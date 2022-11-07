

   var defaults = {
      height: "50px",
      width:"50px",
      href:""
   };

   const HTML = `<div class='status' ></div> <span class="img" ></span>`;

   class AsyncImage {
	 static queue = [];			
	 static workers = 0;
	 attr = {};
	 opts = null;

     constructor(elem, opts) {
		this.elem = elem;
		
		this.attr = {
			src: this.elem.attr('src'),
			href: this.elem.attr('href'),
			height: this.elem.attr('height'),
			width: this.elem.attr('width')
		}

		this.elem[0].style.height = this.attr.height;
		this.elem[0].style.width  = this.attr.width;	
		
		this.elem.addClass('async-image').html(HTML);
		
		var x = 	this.attr.href ? `<a href='${this.attr.href}' target="_blank"><img /></a>` : `<img />`
		this.elem.find('span.img').html(x);	

		AsyncImage.show.loading(this.elem);			

		AsyncImage.add({current: this.elem, src:this.attr.src});
     }


	
	static async add(obj){
		
		AsyncImage.queue.push(obj);

		if(AsyncImage.workers < 4){ 
			AsyncImage.workers++;
			setTimeout(AsyncImage.initWorker)
		}
	}
	
	static async initWorker() {	
		while(AsyncImage.queue.length>0) await AsyncImage.process();		
		AsyncImage.workers--;		 
	}
	
	static show = {
		
		error:   elem =>{ $(elem).find('.status').html('<div class="error"><div /></div>'); },
		loading: elem =>{ $(elem).find('.status').html('<div class="spinner"><div /></div>'); },
		image:   (elem, src) =>{ 
			$(elem).find('img')[0].src = src; 
			$(elem).find('.status').html("");
		}
	}
	
	static process(){
		
		return  new Promise(resolve => {
			
			var item = AsyncImage.queue.shift();

			var img = new Image();
			img.src = item.src;
				
			img.onload = function(){	
				AsyncImage.show.image(item.current, this.src);		
				resolve();
			}	
			
			img.onerror = function(){
				AsyncImage.show.error(item.current);
				resolve();
			}				
		});
	}	 
}








 $.fn.asyncimage = function(opts){
	return new AsyncImage(this, opts);
}



