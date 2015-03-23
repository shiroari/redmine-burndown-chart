class Speaker {

	say(msg = 'hello') {
		console.info(msg);
		return msg;
	}

}


module.exports = Speaker;