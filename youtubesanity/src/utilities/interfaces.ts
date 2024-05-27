interface Video {
	title: string; // video title
	image: string; // url to video thumbnail image
	link: string; // url to video
	creator: string; // creator name
	creatorLink: string; // url to creator profile
	element: HTMLElement; // video HTML element
	visible: boolean; // Is the video classified as visible or not?
}

export {
	Video
}