# Architektur – Chatserver Projekt

## 1. Systemübersicht
Das System besteht aus zwei Hauptkomponenten:

1. **Server (Backend)**  
   - Verbindungsmanagement der Clients  
   - Empfang und Weiterleitung von Nachrichten  
   - Logging von Nachrichten und Verbindungen  
   - Stabilität und Fehlerbehandlung  

2. **Client (Frontend)**  
   - Webbasierte Benutzeroberfläche (HTML/CSS/JS)  
   - Anzeige empfangener Nachrichten  
   - Senden von Nachrichten an den Server  
   - Benutzername-Eingabe  
   - Scroll-Funktion im Chatfenster  

3. **Kommunikation**  
   - Über WebSocket oder TCP  
   - Echtzeitübertragung von Nachrichten  
   - Nachrichten werden an alle verbundenen Clients verteilt (Broadcast)  

---

## 2. Technische Komponenten

| Komponente | Aufgabe |
|------------|---------|
| Server | Verwaltung der Verbindungen, Nachrichtenaustausch, Logging |
| Client | Webinterface, Nachrichten senden/anzeigen, Benutzerinteraktion |
| Netzwerk | Übertragungsprotokoll (WebSocket / TCP) |
| Repository | Code, Dokumentation, Tests, Projektmanagement |
| GitHub Project Board | Aufgabenplanung, Issues, Meilensteine |

---

## 3. Ordnerstruktur
