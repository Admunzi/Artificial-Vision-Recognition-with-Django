import os
import cv2
from ultralytics import YOLO
import json

def detect_objects_in_video(video_path, id):
    model = YOLO('yolov8n.pt')

    # Open video file
    video = cv2.VideoCapture(video_path)
    if not video.isOpened():
        raise IOError("Cannot open video file")
    
    all_frames_detected_json = []
    # Add vidoe fps to all frames
    all_frames_detected_json.append(video.get(cv2.CAP_PROP_FPS))
    
    # SAVE VIDEO
    """
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    video_name = os.path.splitext(os.path.basename(video_path))[0]
    
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(video_name+".mp4", fourcc, 20.0, (width, height))
    """
    
    
    # Each frame of video is detected
    while video.isOpened():
        # Read next frame
        success, frame = video.read()

        if success:
            results = model.predict(frame, conf=0.3, verbose=False)
            
            # Get bounding box coordinates
            for result in results:
                boxes = result.boxes.cpu().numpy()
                frame_detected = []
                for box in boxes:
                    r = box.xyxy[0].astype(int)
                    frame_detected.append([str(result.names[box.cls[0]]), int(r[0]), int(r[1]), int(r[2]), int(r[3])])
                    
                    # SAVE VIDEO
                    # cv2.rectangle(frame, (r[0], r[1]), (r[2], r[3]), (0, 255, 0), 2)

            # SAVE VIDEO    
            # Escribe el fotograma con las detecciones en el nuevo video
            #out.write(frame)

            all_frames_detected_json.append(frame_detected)
        else:
            break

    # Release video
    video.release()
    
    # SAVE VIDEO
    #out.release()
    print("Video processed")
    
    save_detected_frames(all_frames_detected_json, id)

def save_detected_frames(all_frames_detected_json, id):
    all_frames_detected_json = json.dumps(all_frames_detected_json)
    file_path = os.path.join('recognition/static/media_saved/json', f'detected_{id}.json')

    with open(file_path, 'w') as file:
        file.write(all_frames_detected_json)