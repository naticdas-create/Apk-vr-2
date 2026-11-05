set -e
mkdir -p www/vendor www/models
rm -rf www/vendor/tasks-vision
cp -r node_modules/@mediapipe/tasks-vision www/vendor/tasks-vision
[ -f www/models/hand_landmarker.task ] || curl -L -o www/models/hand_landmarker.task \
 https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task
