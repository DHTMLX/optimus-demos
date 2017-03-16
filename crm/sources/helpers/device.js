export const device = {
	getType(){
		const scr = Math.max(screen.width, screen.height);
		return (scr<1024?"phone":(scr<1280?"tablet":"desktop"));
	},
	getOrientation(){
		return screen.width>screen.height?true:false;
	}
};