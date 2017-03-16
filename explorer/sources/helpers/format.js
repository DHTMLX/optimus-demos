export function sizeFormat(size){
	let i = false;
	let b = ["b","Kb","Mb","Gb","Tb","Pb","Eb"];
	for (let q=0; q<b.length; q++){
		if (size > 1024){
			size = size / 1024; 
		} 
		else if (i === false){
			i = q;
		} 
	} 
	if (i === false) i = b.length-1;
	return Math.round(size*100)/100+" "+b[i];
}