if [ -f deploy.cfg ]
then
	source ./deploy.cfg
	cd $IMPL
	$SCRIPT
else
	cd ./_deploy
	PAST_USER=$USER
	sudo make USER=${PAST_USER} run
fi
