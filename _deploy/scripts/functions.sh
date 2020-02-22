exists () {
	if [ $(command -v ${1}) ]; then
		echo 1
	fi
}
