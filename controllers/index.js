exports.index = (req,res,next) => {
  res.writeHead(200,{'Content-Type':'text/plain'});
	res.end('hello world\n');
}
