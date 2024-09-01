const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(err => {
        console.error("Error accessing webcam: ", err);
    });

video.addEventListener('play', () => {
    const detectFace = () => {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        let src = cv.imread(canvas);
        let gray = new cv.Mat();
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
        let faces = new cv.RectVector();
        let classifier = new cv.CascadeClassifier();
        classifier.load('haarcascade_frontalface_default.xml');
        classifier.detectMultiScale(gray, faces, 1.1, 3, 0);
        
        for (let i = 0; i < faces.size(); i++) {
            let point1 = new cv.Point(faces.get(i).x, faces.get(i).y);
            let point2 = new cv.Point(faces.get(i).x + faces.get(i).width, faces.get(i).y + faces.get(i).height);
            cv.rectangle(src, point1, point2, [255, 0, 0, 255]);
        }
        
        cv.imshow('canvas', src);
        src.delete(); gray.delete(); faces.delete(); classifier.delete();
        requestAnimationFrame(detectFace);
    };
    detectFace();
});
