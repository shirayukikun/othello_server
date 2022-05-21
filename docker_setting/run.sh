set -eu
IP_ADDRESS=`hostname -I | cut -d ' ' -f1`

if [[ ${IP_ADDRESS} = 192.168.100.* ]]; then
    echo "This is Inui Lab server!"	
    docker run -it \
       --platform linux/x86_64 \
       --rm  \
       --mount type=bind,source="${HOME}/lab/private/othello_server",target="/home/keitonlp/lab/private/othello_server" \
       --shm-size=2gb \
       -p 61699:61699 \
       --gpus all \
       --mount type=bind,source=/etc/group,target=/etc/group,ro \
       --mount type=bind,source=/etc/passwd,target=/etc/passwd,ro \
       -u $(id -u ${USER}):$(id -g ${USER}) \
       othellobert

else
    docker run -it \
       --platform linux/x86_64 \
       --rm  \
       --mount type=bind,source="${HOME}/lab/private/othello_server",target="/home/keitonlp/lab/private/othello_server" \
       --shm-size=2gb \
       -p 61699:61699 \
       othellobert
fi



