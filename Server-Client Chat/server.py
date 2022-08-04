

import socket
import select
import time
import threading

# ----- setup host and port -----
HEADER_LENGTH = 10
IP = "127.0.0.1"
PORT = 1234

# ----- initialize socket and bind ----
server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)

server_socket.bind((IP, PORT))
server_socket.listen()

sockets_list = [server_socket]

clients = {} 

# ----- receive messages ------
def receive_message(client_socket):
    # check for valid message
    try:
        message_header = client_socket.recv(HEADER_LENGTH)

        if not len(message_header):
            return False

        message_length = int(message_header.decode("utf-8").strip())
        return {'header': message_header, 'data': client_socket.recv(message_length)}


    except:
        return False
        

# ----- managing clients-----
while True:
    read_sockets, _, exception_sockets = select.select(sockets_list, [], sockets_list)

    for notified_socket in read_sockets:
        if notified_socket == server_socket:
            client_socket, client_address = server_socket.accept()

            user = receive_message(client_socket)
            if user is False:
                continue

            sockets_list.append(client_socket)

            clients[client_socket] = user

            print(f"{user['data'].decode('utf-8')} has joined the chat")
        
        else:
            message = receive_message(notified_socket)

            if message == '/q':
                print(f"{clients[notified_socket]['data'].decode('utf-8')} has left the chat")
                sockets_list.remove(notified_socket)
                del clients[notified_socket]
                break

            if message is False:
                print(f"{clients[notified_socket]['data'].decode('utf-8')} has left the chat")
                sockets_list.remove(notified_socket)
                del clients[notified_socket]
                continue

            user = clients[notified_socket]

            print(f"{user['data'].decode('utf-8')}: {message['data'].decode('utf-8')}")

            for client_socket in clients:
                if client_socket != notified_socket:
                    client_socket.send(user['header'] + user['data'] + message['header'] + message['data'])
    
    for notified_socket in exception_sockets:
        sockets_list.remove(notified_socket)
        del clients[notified_socket]
