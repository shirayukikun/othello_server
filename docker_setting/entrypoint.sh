CODE_DIR="${HOME}/lab/private/othello_server/lib"
wandb login `cat ${HOME}/lab/private/othello_server/docker_setting/.wandb_api_key.txt`

cd "${CODE_DIR}/libedax4py-0.1.1"
echo 'Installing libedax...'
pip install --editable .
cd

cd "${CODE_DIR}/transformers"
echo 'Installing transformers...'
pip install --editable .
cd

cd "${CODE_DIR}/othello_lib"
echo 'Installing othello_lib...'
pip install --editable .
cd


DOCKER_SETTING_DIR="${HOME}/lab/private/othello_server/docker_setting"
ENTER_DIR=`cat ${DOCKER_SETTING_DIR}/enter_dir.txt`
cd $ENTER_DIR

echo 'done.'
zsh
