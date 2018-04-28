(function(w) {
	var defaultOpts = {
        delay: 2000
    };
	var addEvents =  (function () {
        if (window.addEventListener) {
            return function(target, type, handler) {
                target.addEventListener(type,handler,false);
            };
        } else if (window.attachEvent) {
            return function(target, type, handler) {
                target.attachEvent("on" + type, handler);
            };
        }
    })();
	function Imgfidein(targetId,opts) {
		this.targetId = document.getElementById(targetId);
		this.delay = opts.delay;
		this.slideBox = this.targetId.querySelector('.vk-slide');
		this.videoBg = this.targetId.querySelector('.vk-video');
		this.content = this.targetId.querySelector('.vk-content');
		this.contItems = this.content.querySelectorAll('.content-item');
		this.controlBox = this.targetId.querySelector('.vk-control');

		opts = opts || defaultOpts;
        for (var k in defaultOpts) {
            if(!opts[k]) {
                opts[k] = defaultOpts[k];
            }
        }
        for (var k in opts) {
            this[k] = opts[k];
        }
		this.index = 1;
		this.timer = null;
		this.init();
	}
	Imgfidein.prototype = {
		constructor: Imgfidein,
		init: function() {
			this._createNode();
			this._addEvents();
			this.timer = setInterval(this._autoPlay(),this.delay);
		},
		_createNode: function() {
			for(var i = 0; i < this.imgs.length; i++) {
				var span = document.createElement('span'),
					img = document.createElement('img');
				span.classList.add('control-item');
				span.setAttribute('data-id',i);
				img.classList.add('slide-item');
				img.setAttribute('src', this.imgs[i].url);
				if(i === 0) {
					span.classList.add('active');
					img.classList.add('active');
				}
				this.controlBox.appendChild(span);
				this.slideBox.appendChild(img);
			}
			this.controls = this.controlBox.querySelectorAll('.control-item');
			this.imgItems = this.slideBox.querySelectorAll('.slide-item');
			if(document.querySelector('body').scrollWidth > 750) {
				if(this.video) {
					var video = document.createElement('video');
					video.setAttribute('autoplay','autoplay');
					video.setAttribute('loop','loop');
					for(var i = 0; i < this.video.length; i++) {
						var source = document.createElement('source');
						source.setAttribute('src',this.video[i].url);
						source.setAttribute('type',this.video[i].type);
						video.appendChild(source);
					}
					this.videoBg.appendChild(video);
					this.videoEle = video;
				}else {
					this.videoBg.style.display = 'none';
				}
			}else {
				this.videoBg.style.display = 'none';
			}
		},
		_autoPlay: function() {
			var self = this;
			return function() {
				self._animateFideIn(self.imgItems[self.index]);
				self.index++;
				self.index > self.imgItems.length - 1 ? self.index = 0 : self.index;
			}
		},
		_animateFideIn: function(obj) {
			var self = this;
			this._setSlideItem();
			clearInterval(obj.timer);
			obj.timer = setInterval(function() {
				obj.classList.add('active');
				clearInterval(obj.timer);
			}, 15);
			self._setControl();
			self._setContent();
		},
		_setSlideItem: function() {
			for(var i = 0; i < this.imgItems.length; i++) {
				this.imgItems[i].className = 'slide-item';
			}
		},
		_setContent: function() {
			for(var i = 0; i < this.contItems.length; i++) {
				this.contItems[i].className = 'content-item';
			}
			this.contItems[this.index].classList.add('active');
		},
		_setControl: function() {
			for(var i = 0; i < this.controls.length; i++) {
				this.controls[i].className = 'control-item';
			}
			this.controls[this.index].className += ' active';
		},
		_addEvents: function() {
			var self = this;
			for(var k in this.controls) {
				if(k.length === 1) {
					addEvents(this.controls[k],'click',function() {
						var num = this.getAttribute('data-id') - 0;
						self.index = num;
						self._animateFideIn(self.imgItems[self.index]);
					});
				}
			};
			if(document.querySelector('body').scrollWidth > 750) {
				addEvents(self.videoEle,'canplaythrough',function() {
						self.videoBg.style.display = 'block';
						self.slideBox.style.display = 'none';
				});
			}
			addEvents(self.content,'mouseenter',function() {
				if(document.querySelector('body').scrollWidth > 750) {
					clearInterval(self.timer);
				}
				self.slideBox.style.display = 'block';
				self.videoBg.style.display = 'none';
			});
			addEvents(self.content,'mouseleave',function() {
				if(document.querySelector('body').scrollWidth > 750) {
					clearInterval(self.timer);
				}
				self.timer = setInterval(self._autoPlay(),self.delay);
				self.slideBox.style.display = 'none';
				self.videoBg.style.display = 'block';
			});
		}
	};

    if(typeof define !== "undefined" && typeof define === "function") {
        define("Imgfidein",[],function(){
            return Imgfidein;
        });
    }else {
        w.Imgfidein = Imgfidein;
    }
	
})(window);
