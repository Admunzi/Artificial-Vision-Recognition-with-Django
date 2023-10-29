import os
import cv2
from ultralytics import YOLO

def detect_objects_in_video(video_path):
    # Carga el modelo YOLOv8 pre-entrenado
    model = YOLO('yolov8n.pt')

    # Abre el archivo de video
    cap = cv2.VideoCapture(video_path)
    
    # Obtiene el ancho y alto del video
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    
    video_name = os.path.splitext(os.path.basename(video_path))[0]
    
    # Define el codificador de video y el objeto VideoWriter
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter("videos/process/"+video_name+".mp4", fourcc, 20.0, (width, height))
    
    # Bucle a través de los fotogramas de video
    while cap.isOpened():
        # Lee un fotograma del video
        success, frame = cap.read()

        if success:
            results = model.predict(frame, conf=0.2, verbose=False)
            
            # Dibuja las cajas delimitadoras y etiquetas de detección en el fotograma
            for result in results:
                boxes = result.boxes.cpu().numpy()
                for box in boxes:     
                    r = box.xyxy[0].astype(int)
                    # Draw name of object detected
                    cv2.rectangle(frame, (r[0], r[1]), (r[2], r[3]), (0, 255, 0), 2)
                    cv2.putText(frame, str(result.names[box.id()]), (r[0], r[1]),
                                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
                    
            # Escribe el fotograma con las detecciones en el nuevo video
            out.write(frame)
            
        else:
            break

    # Libera el video
    cap.release()
    out.release()
    print("Video processed")