import cv2
from ultralytics import YOLO

def detect_objects_in_video(video_path):
    # Carga el modelo YOLOv8 pre-entrenado
    model = YOLO('yolov8n.pt')

    # Abre el archivo de video
    cap = cv2.VideoCapture(video_path)

    # Definir un salto de frames
    skip_frames = 2  # Saltar cada 2 frames, por ejemplo

    # Contador de frames
    frame_count = 0

    # Lista para almacenar los resultados de detección
    detections = []

    # Bucle a través de los fotogramas de video
    while cap.isOpened():
        # Lee un fotograma del video
        success, frame = cap.read()

        if success:
            # Verifica si es el momento de procesar este fotograma
            if frame_count % skip_frames == 0:
                # Realiza la inferencia YOLOv8 en el fotograma
                results = model.predict(frame, conf=0.5)

                # Almacena los resultados de detección
                for det in results:
                    detections.append({
                        'class': model.names[det],
                        'bbox': [int(det[0]), int(det[1]), int(det[2]), int(det[3])]
                    })

            frame_count += 1
        else:
            break

    # Libera el video
    cap.release()

    # Devuelve los resultados de detección
    print(detections)
    return detections

detect_objects_in_video('test2.mp4')