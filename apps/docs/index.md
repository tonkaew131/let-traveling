# Project Pitching

# 1. Problem Statement

## 1.1 ปัญหาหรือความต้องการที่ต้องการแก้ไข

## 1.2 กลุ่มผู้ใช้งานเป้าหมาย

นักท่องเที่ยวที่ต้องการเดินทางด้วยตัวเอง

## 1.3 ทําไมต้องใช้ Generative AI

# 2. Proposed Solution

## 2.1 แนวคิดของระบบ

## 2.2 บทบาทของ LLM / Agentic AI / AI Agent ในระบบ

## 2.3 จุดเด่นหรือความแตกต่างจากระบบทั่วไป

# 3. System Design & Architecture

## 3.1 ภาพรวมสถาปัตยกรรมระบบ

## 3.2 Workflow การทํางานแบบ step-by-step

# 4. Feasibility & Expected Outcome

## 4.1 เทคโนโลยีที่ใช้

- Model Provider; Google AI Studio, OpenRouter API
- Models ที่ใช้; Gemini 3 Flash, Qwen3.5 Plus
- AI SDK ของ vercel สำหรับเชื่อมต่อ Model provider (Agent framework)
- PostgreSQL + pgVector ฐานข้อมูล / memory ของ LLM
- Duffel API สำหรับดึงที่พัก และ Flight
- OpenWeatherMap สำหรับดึงสภาพอากาศ
- Google Places API และ Directions API สำหรับหาสถานที่ท่องเที่ยว และคำนวนการเดินทาง
- Tech Stacks อื่นๆ
    - Tanstack Start สำหรับสร้างเว็บ
    - DrizzleORM สำหรับติดต่อกับฐานข้อมูล
    - TailwindCSS และ ShadCN/ui
    - Puppeteer สำหรับสร้าง PDF

## 4.2 แผนการพัฒนาโดยสังเข

one night miracle คืนสุดท้ายก่อนส่ง

## 4.3 ผลลัพธ์ที่คาดว่าจะสาธิตได้ในวัน Showcase

---