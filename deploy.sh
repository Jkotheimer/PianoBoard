if [ -f deploy.cfg ]
then
	source ./deploy.cfg
	cd $IMPL
	$SCRIPT
else
	cd ./_deploy
	make run
fi
