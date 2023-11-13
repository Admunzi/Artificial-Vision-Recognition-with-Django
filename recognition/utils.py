import os
import cv2
from ultralytics import YOLO
import json


def detect_objects_in_video(video_path, id):
    # Initialize YOLO model
    model = YOLO('recognition/yolov8n.pt')

    # Open video file
    video = cv2.VideoCapture(video_path)
    if not video.isOpened():
        raise IOError("Cannot open video file")

    # Get frames per second (FPS) of the video
    fps = video.get(cv2.CAP_PROP_FPS)
    all_frames_detected_json = [fps]

    # Run YOLO on the video
    results = model(video_path, conf=0.3, verbose=False)

    # Get bounding box coordinates for each detected object
    for result in results:
        all_frames_detected_json.append(get_box_frames(result))

    # Release video
    video.release()

    print("Video processed")

    # Save the detected frames to a JSON file
    save_frames(all_frames_detected_json, id)


def get_box_frames(result):
    # Extract bounding box coordinates from YOLO result
    boxes = result.boxes.cpu().numpy()
    frame_detected = []
    for box in boxes:
        r = box.xyxy[0].astype(int)
        frame_detected.append([str(result.names[box.cls[0]]), int(r[0]), int(r[1]), int(r[2]), int(r[3])])
    return frame_detected


def save_frames(all_frames, id):
    # Convert the list of frames to a JSON-formatted string
    all_frames_json = json.dumps(all_frames)

    # Define the file path to save the JSON file
    file_path = f'recognition/static/media_saved/json/detected_{id}.json'

    # Write the JSON data to the file
    with open(file_path, 'w') as file:
        file.write(all_frames_json)
