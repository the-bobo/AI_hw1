(1) input file must be utf-8 encoded

(2) Node crashes when it runs out of memory, so to get around that run like:
	node --max-old-space-size=4000 tilepuzajb90.js tilepuzinput.txt 

This allocates 4GB of memory to node.

(3) Correct usage is: node --max-old-space-size=4000 tilepuzajb90.js filename.txt

(4) filename.txt must also be in the same directory as tilepuzajb90.js

(5) you will need nodejs installed: Kubuntu should have it in apt-get (Ubuntu 14.04 does):
	Easy Install:
	curl -sL https://deb.nodesource.com/setup | sudo bash -
	sudo apt-get install -y nodejs


If that didn't work: email me - the.bobo@gmail.com or see: 
	(1) https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager
	(2) https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-an-ubuntu-14-04-server


