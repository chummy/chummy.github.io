import { Selfie } from 'simple-selfie';
import { Processors } from "simple-selfie";

const container = document.querySelector('.selfie-container');
const overlay = document.querySelector('.selfie-overlay');

const facePositions = {
  isLookUp: document.querySelector('.face-position__direction_top'),
  isLookRight: document.querySelector('.face-position__direction_left'),
  isLookDown: document.querySelector('.face-position__direction_bottom'),
  isLookLeft: document.querySelector('.face-position__direction_right'),
};

const selfie = new Selfie({
  container,
  onFaceFrameProcessed: ({ face, faceFrame, overlayVisible, detection }) => {
    if (face) {
      const faceWidth = face.getWidth();
      const deviationFaceWidth = Math.abs(FACE_WIDTH - faceWidth);
      const deviationFacePosition = face.getFacePosiotion();
      const overlayVisible = deviationFaceWidth > FACE_DEVIATION || deviationFacePosition > FACE_DEVIATION;
      if (overlayVisible) {
        overlay.classList.add('overlay_visible');
      } else {
        overlay.classList.remove('overlay_visible');
      }
    }
  
    for (const key in facePositions) {
      if (face.direction[key]()) {
        facePositions[key].classList.add('face-position__direction_visible');
      } else {
        facePositions[key].classList.remove('face-position__direction_visible');
      }
    }
  }
});

const selfieImage = selfie.capture();
const frame = {
  width: selfie.video.videoWidth,
  height: selfie.video.videoHeight,
};
const faceFrame = {
  width: 200,
  height: 200,
};
// captureImage returns Uint8Array
const data = selfie.captureImage();
// convert uint8array to image
const image = await Processors.toImage(frame, data);

// use processors to process the image to detect blur
const cropped = await Processors.cropFrame(frame, lastFaceFrame, data);
const resized = await Processors.resizeFrame(lastFaceFrame, faceFrame, cropped);
const laplacian = await Processors.laplacian(faceFrame, resized);
const laplacianImage = await Processors.toImage(faceFrame, laplacian);
const blurVarianceResult = await Processors.variance(laplacian);

resultImage.src = image;
resultLaplacian.src = laplacianImage;

resultImageBlurred.textContent = 'Not blurred ' + Math.round(blurVarianceResult);
if (blurVarianceResult < 1100) {
  resultImageBlurred.classList.add('result-image__blurred_blurred');
  resultImageBlurred.textContent = 'Blurred ' + blurVarianceResult;
} else {
  resultImageBlurred.classList.remove('result-image__blurred_blurred');
}
