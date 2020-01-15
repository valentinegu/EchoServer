'use strict';

const minimist = require('minimist');
let argv = minimist(process.argv.slice(2), {
    alias: {
		H: 'help',
		h: 'help',
		P: 'port',
		p: 'port',
		U: 'udp',
		u: 'udp',
		E: 'expect',
		e: 'expect',
		R: 'reply',
		r: 'reply',
		B: 'binary',
		b: 'binary'
	},
	default: {
		port: 8000
	}
});

console.log(argv)
var help = 
'\nWelcome to the ECHO Server!\
\nThe purpose of this application is to create a listener on any TCP or UDP port\
\n\nArguments:\n\
\n\t-h \\ --help  \t Print help menu (this output)\
\n\t-u \\ --udp  \t UDP listener\
\n\t-p \\ --port \t Port to use\
\n\t-b \\ --binary \t Expect binary string (only used with -e and -r options)\
\n\t-e \\ --expect \t String to expect\
\n\t-r \\ --reply \t String to respond\
\n\
\nUsage:\n\
\n Listen for TCP port 81 \
\n\t' + process.argv[1] + ' -p 81\n\
\n Listen for UDP port 5060\
\n\t' + process.argv[1] + ' -u -p 5060\n\
\n Listen for TCP port 81, expect received hex to match \"00bbae\" and respond \"11aa22\" \
\n\t' + process.argv[1] + ' -b -p 81 -e \"00bbae\" -r \"11aa22\" \n\
\n Listen for UDP port 50, expect received plain text string to match \"hello\" and respond \"world\" \
\n\t' + process.argv[1] + ' -u -p 5060 -e \"hello\" -r \"world\"\n'


if ('help' in argv) {
	 console.log (help);
	 return;
}

if ( 'udp' in argv ) {
	var dgram = require('dgram');
	var server = dgram.createSocket('udp4');

	server.on('listening', function() {
		var address = server.address();
		console.log('UDP Server listening on ' + address.address + ':' + address.port);
	});

	server.on('message', function(message, remote) {
		// console.log(remote.address + ':' + remote.port +' Clear text message = ' + message);
		console.log(remote.address + ':' + remote.port +' HEX message = ' + message.toString('hex'));
		if ( 'expect' in argv && 'reply' in argv && 'bin' in argv && argv.expect === message.toString('hex')) {
			console.log("match binary expect")
			var reply = Buffer.from(argv.reply, 'hex')
		} else if ( 'expect' in argv && 'reply' in argv && argv.expect === message) {
			console.log("match expect")
			var reply = argv.reply
		} else {
			var reply = message ;
		}
		server.send(reply,remote.port,remote.address,function(error){
			if(error){ 
				console.log('Error=' + error);
				client.close();
			} else { 
				console.log('Sent response = ' + reply); 
			}
		});
	});

	server.bind( argv.port, '0.0.0.0' );
} else {
	var net = require('net');

	var server = net.createServer(function(socket){
		socket.write('Connected to ' + socket.localAddress.split(':')[3] + ' !\r\n');
		socket.on('data', function(message) {
			if ('binary' in argv){
				console.log('Received: ' + message.toString('hex').trim());	
			} else {
				console.log('Received: ' + message.toString());
			}
			if ( 'expect' in argv && 'reply' in argv && 'binary' in argv && argv.expect === message.toString('hex').trim()) {
				console.log("match binary expect")
				var reply = Buffer.from(argv.reply, 'hex')
			} else if ( 'expect' in argv && 'reply' in argv && argv.expect === message.toString().trim()) {
				console.log('Match expect!')
				var reply = argv.reply
			} else {
				var reply = message ;
			}
			socket.write(reply);
		});
	});

	console.log('TCP Server listening on 0.0.0.0:'+argv.port);
	server.listen(argv.port);
}
