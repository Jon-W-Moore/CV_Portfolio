# Jon Moore
# CS 372
# Project 4

# Sources:
# https://www.youtube.com/watch?v=CV7_stUWvBQ&t=1338s
# https://learningactors.com/creating-command-line-based-chat-room-using-python/

import socket
import select
import errno
import sys
import threading
import os

# ----- setup host and port -----
HEADER_LENGTH = 10
IP = "127.0.0.1"
PORT = 1234

# ----- get username -----
my_username = input('Username: ')

# ----- intialize socket and connect -----
client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
client_socket.connect((IP, PORT))
client_socket.setblocking(False)

# ----- create username -----
username = my_username.encode('utf-8')
username_header = f"{len(username):<{HEADER_LENGTH}}".encode('utf-8')
client_socket.send(username_header + username)

# ----- receive messages -----
def receive_message():
    while True:
        try:
            # receive things
            username_header = client_socket.recv(HEADER_LENGTH)
            if not len(username_header):
                print('conncetion closed by the server')
                sys.exit()

            username_length = int(username_header.decode('utf-8').strip())
            username = client_socket.recv(username_length).decode('utf-8')

            message_header = client_socket.recv(HEADER_LENGTH)
            message_length = int(message_header.decode('utf-8').strip())
            message = client_socket.recv(message_length).decode('utf-8')

            # display message
            print(f"{username} > {message}")

        # ----- error handling -----
        except IOError as e:
            if e.errno != errno.EAGAIN and e.errno != errno.EWOULDBLOCK:
                print('reading error:',str(e))
                sys.exit()

        except Exception as e:
            print('General errer',str(e))
            sys.exit()


# ----- send messages -----
def send_message():
    while True:

        message = input(f"")

        # exit if /q entered
        if message == ('/q'):
            print('conncetion closed')
            os._exit(1)

        if message:
            message = message.encode('utf-8')
            message_header = f"{len(message):<{HEADER_LENGTH}}".encode('utf-8')
            client_socket.send(message_header + message)


# ----- threading to allow for mulitple simultaneous users to interact in real time -----
receive_thread = threading.Thread(target=receive_message)               
receive_thread.start()
write_thread = threading.Thread(target=send_message)                   
write_thread.start()