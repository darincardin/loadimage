


   var defaults = {
      height: "50px",
      width:"50px",
      href:""
   };

   const HTML = `
   						<div class='status' ></div> 
   						<span class="img" ></span>
   				`;

   class LoadImage {
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

		
		
		LoadImage.show.loading(this.elem);			


		LoadImage.add({current: this.elem, src:this.attr.src});
     }


	
	static async add(obj){
		
		LoadImage.queue.push(obj);

		if(LoadImage.workers < 4){ 
			LoadImage.workers++;
			setTimeout(LoadImage.initWorker)
		}
	}
	
	static async initWorker() {	
		while(LoadImage.queue.length>0) await LoadImage.process();		
		LoadImage.workers--;		 
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
		
		return  new Promise((resolve, reject) => {
			
			var item = LoadImage.queue.shift();

			var img = new Image();
			img.src = item.src;
				
			img.onload = function(){	
				LoadImage.show.image(item.current, this.src);		
				resolve();
			}	
			
			img.onerror = function(){
				LoadImage.show.error(item.current);
				resolve();
			}				
		});
	}	 
}








 $.fn.loadimage = function(opts){
	return new LoadImage(this, opts);
}



