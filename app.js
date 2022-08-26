// dat GUI
const gui = new dat.GUI();
const obj = {
	progress: 0,
	stopMusic,
	playMusic,
	restartMusic,
	startFromAfterFall: () => {
		stopMusic();
		music.currentTime = 0;
		timeline.seek("afterFall");
	},
	restartAnimation: () => {
		stopMusic();
		music.currentTime = 0;
		timeline.restart();
	},
};

const progressController = gui.add(obj, "progress", 0, 1, 0.001).listen();
progressController.onChange((value) => {
	timeline.progress(value);
	timeline.pause();
	stopMusic();
	music.currentTime = 0;
});
gui.add(obj, "startFromAfterFall");
gui.add(obj, "restartAnimation");
gui.add(obj, "stopMusic");
gui.add(obj, "playMusic");
gui.add(obj, "restartMusic");

// gui function
function stopMusic() {
	music.pause();
	concusition.pause();
}
function playMusic() {
	music.play();
	concusition.play();
}
function restartMusic() {
	concusition.restart();
	music.currentTime = 0;
	music.play();
}

// Music
let music = new Audio("https://awiclass.monoame.com/audio/ea0410353.mp3");
music.volume = 0.24;

// Gsap Start
const timeline = gsap.timeline({
	onUpdate() {
		obj.progress = timeline.progress();
		if (parseInt(obj.progress) === 1 && music.paused)
			setTimeout(() => {
				concusition.restart();
				music.play();
			}, 800);
	},
});

timeline.set("#antenna", {
	transformOrigin: "0% 100%",
	y: -2.5,
	rotation: 90,
});

timeline
	.from("#radio-body", 1.5, {
		y: "-=300",
		ease: "bounce.out",
	})
	.from("#radio-body", 0.6, {
		opacity: 0,
		delay: -1.5,
		ease: "none",
	})
	.add("afterFall");

const shadow = gsap.from("#shadow", 1.5, {
	scale: 1.5,
	opacity: 0,
	ease: "bounce.out",
	transformOrigin: "50% 50%",
});
timeline.add(shadow, 0);

let concusition = gsap.to("#drivers", 0.24, {
	transformOrigin: "50% 50%",
	scale: 1.1,
	repeat: -1,
	yoyo: true,
});
concusition.pause();

timeline
	.to("#btn-control", 0.4, { rotation: 45, transformOrigin: "center bottom" })
	.from("#red-line-container", 0.4, { scaleX: 0.24 })
	.from("#text", 0.8, {
		opacity: 0.24,
		delay: 0.4,
		ease: "rough({ template: none.out, strength: 1, points: 20, taper: none, randomize: true, clamp: false})",
	})
	.to("#antenna", 0.8, {
		rotation: 45,
		delay: -0.8,
		onComplete() {
			restartMusic();
		},
	});
