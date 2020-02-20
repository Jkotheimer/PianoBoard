while [ ! -d ./_api ]
do
	cd ..
done

JDIR="$(pwd)/_api/java_api"
echo "Java directory: $JDIR"
CLIENT="$(pwd)/_client"
echo "Client directory: $CLIENT"
