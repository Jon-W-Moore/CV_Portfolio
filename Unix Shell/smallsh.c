#include <sys/types.h>
#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <signal.h>
#include <fcntl.h>

#define inputLength 2048

int allowBackground = 1;

void getInput(char*[], int*, char[], char[], int);
void execCommand(char*[], int*, struct sigaction, int*, char[], char[]);
void catchSIGTSTP(int);
void printExitStatus(int);

// main()
// gets: input 
// checks: blanks, comments, processes, CD, EXIT, STATUS


int main() {

	int pid = getpid();
	int cont = 1;
	int i;
	int exitStatus = 0;
	int background = 0;

	char inputFile[256] = "";
	char outputFile[256] = "";
	char* input[512];
	for (i=0; i<512; i++) {
		input[i] = NULL;
	}


	
	// ignore control + C
	struct sigaction sa_sigint = {0};
	sa_sigint.sa_handler = SIG_IGN;
	sigfillset(&sa_sigint.sa_mask);
	sa_sigint.sa_flags = 0;
	sigaction(SIGINT, &sa_sigint, NULL);

	// redirect control + z
	struct sigaction sa_sigtstp = {0};
	sa_sigtstp.sa_handler = catchSIGTSTP;
	sigfillset(&sa_sigtstp.sa_mask);
	sa_sigtstp.sa_flags = 0;
	sigaction(SIGTSTP, &sa_sigtstp, NULL);

	do {
		getInput(input, &background, inputFile, outputFile, pid);

		// check for blank or comment
		if (input[0][0] == '#' ||
				input[0][0] == '\0') {
			continue;
		}
		
		else if (strcmp(input[0], "exit") == 0) {
			cont = 0;
		}
	
		// change directory
		else if (strcmp(input[0], "cd") == 0) {
			if (input[1]) {
				if (chdir(input[1]) == -1) {
					printf("directory not found\n");
					fflush(stdout);
				}
			} else {
				chdir(getenv("home"));
			}
		}

		// check status
		else if (strcmp(input[0], "status") == 0) {
			printExitStatus(exitStatus);
		}


		else {
			execCommand(input, &exitStatus, sa_sigint, &background, inputFile, outputFile);
		}


		for (i=0; input[i]; i++) {
			input[i] = NULL;
		}
		background = 0;
		inputFile[0] = '\0';
		outputFile[0] = '\0';

	} while (cont);
	
	return 0;
}

//get input

void getInput(char* arr[], int* background, char inputName[], char outputName[], int pid) {
	
	char input[inputLength];
	int i, j;

	// input
	printf(": ");
	fflush(stdout);
	fgets(input, inputLength, stdin);

	// no new line
	int found = 0;
	for (i=0; !found && i<inputLength; i++) {
		if (input[i] == '\n') {
			input[i] = '\0';
			found = 1;
		}
	}

	// blank
	if (!strcmp(input, "")) {
		arr[0] = strdup("");
		return;
	}

	// parse
	const char space[2] = " ";
	char *token = strtok(input, space);

	for (i=0; token; i++) {
		// ampersand
		if (!strcmp(token, "&")) {
			*background = 1;
		}
		// < input
		else if (!strcmp(token, "<")) {
			token = strtok(NULL, space);
			strcpy(inputName, token);
		}
		// > output
		else if (!strcmp(token, ">")) {
			token = strtok(NULL, space);
			strcpy(outputName, token);
		}

		else {
			arr[i] = strdup(token);
			// handles $$$
			for (j=0; arr[i][j]; j++) {
				if (arr[i][j] == '$' &&
					arr[i][j+1] == '$') {
					arr[i][j] = '\0';
					snprintf(arr[i], 256, "%s%d", arr[i], pid);
				}
			}
		}
		token = strtok(NULL, space);
	}
}

// execute command

void execCommand(char* arr[], int* childExitStatus, struct sigaction sa, int* background, char inputName[], char outputName[]) {
	
	int input, output, result;
	pid_t spawnPid = -5;

	spawnPid = fork();
	switch (spawnPid) {
		
		case -1:	;
			perror("Nope. Not today.\n");
			exit(1);
			break;
		
		case 0:	;
			// control + C default
			sa.sa_handler = SIG_DFL;
			sigaction(SIGINT, &sa, NULL);

			// handle input
			if (strcmp(inputName, "")) {
				input = open(inputName, O_RDONLY);
				if (input == -1) {
					perror("nope. can't open that input file. sorry.\n");
					exit(1);
				}
				result = dup2(input, 0);
				if (result == -1) {
					perror("nope. can't assign that input file. sorry\n");
					exit(2);
				}
				fcntl(input, F_SETFD, FD_CLOEXEC);
			}

			// handle output
			if (strcmp(outputName, "")) {

				output = open(outputName, O_WRONLY | O_CREAT | O_TRUNC, 0666);
				if (output == -1) {
					perror("nope. can't open that output file. sorry.\n");
					exit(1);
				}

				result = dup2(output, 1);
				if (result == -1) {
					perror("nope can't assign that output file. sorry\n");
					exit(2);
				}

				fcntl(output, F_SETFD, FD_CLOEXEC);
			}
			
			// run
			if (execvp(arr[0], (char* const*)arr)) {
				printf("%s: file or directory not found\n", arr[0]);
				fflush(stdout);
				exit(2);
			}
			break;
		
		default:	;
			// background process
			if (*background && allowBackground) {
				pid_t actualPid = waitpid(spawnPid, childExitStatus, WNOHANG);
				printf("background pid: %d\n", spawnPid);
				fflush(stdout);
			}

			else {
				pid_t actualPid = waitpid(spawnPid, childExitStatus, 0);
			}

		// check bg
		while ((spawnPid = waitpid(-1, childExitStatus, WNOHANG)) > 0) {
			printf("here lies child %d. gone too soon.\n", spawnPid);
			printExitStatus(*childExitStatus);
			fflush(stdout);
		}
	}
}

// switch bg boolean

void catchSIGTSTP(int signo) {

	// display message
	if (allowBackground == 1) {
		char* message = "entering foreground-only mode.\n";
		write(1, message, 49);
		fflush(stdout);
		allowBackground = 0;
	}

	else {
		char* message = "exiting foreground-only mode.\n";
		write (1, message, 29);
		fflush(stdout);
		allowBackground = 1;
	}
}

// exit
void printExitStatus(int childExitMethod) {
	
	if (WIFEXITED(childExitMethod)) {
		printf("exit value: %d\n", WEXITSTATUS(childExitMethod));
	} else {
		printf("tragically murdered by signal: %d\n", WTERMSIG(childExitMethod));
	}
}