# Jotform Frontend Challenge Project

## User Information
- **Name**: Efe Aydınalp

## Project Description
This project is an investigation dashboard built for the Jotform Frontend Challenge.

The application analyzes the “Missing Podo: The Ankara Case” by collecting data from multiple Jotform sources and transforming them into a unified investigation interface.

Integrated sources:
- Messages
- Check-ins
- Sightings
- Personal Notes
- Anonymous Tips

These sources are normalized into a shared record structure so the user can:
- inspect a combined timeline
- search and filter people
- view related records for a selected person
- analyze suspicious actors using a simple and explainable suspicious score

## Features
- Multi-source Jotform API integration
- Record normalization layer
- Search and filtering
- Person-based investigation flow
- Related timeline records
- Suspicious score calculation
- Loading, empty, and error states
- Responsive multi-panel dashboard

## Technical Stack
- React
- TypeScript
- Vite
- Tailwind CSS
- TanStack Query

## Getting Started

### 1. Install dependencies
`npm install`

### 2. Create environment file
Create a `.env.local` file in the project root and add:

`VITE_JOTFORM_API_KEY=your_api_key_here`
`VITE_JOTFORM_BASE_URL=https://api.jotform.com`

### 3. Start development server
`npm run dev`

After running the command, open the local development URL shown in the terminal.

## How It Works
The application fetches data from separate Jotform forms and normalizes them into one shared record format.

Each record is converted into a unified structure that includes:
- type
- timestamp
- location
- related people
- content
- urgency/confidence when available

This unified structure is then used to:
- build the people list
- generate the timeline
- filter related records
- calculate a suspicious score
- support the investigation flow through the dashboard

## How to Test
After starting the project:

1. Confirm that the dashboard loads data successfully from Jotform.
2. Verify that the people list is populated on the left panel.
3. Use the search input to filter people by name or note.
4. Use the filter buttons to narrow down the people list.
5. Click on a person in the list and verify that:
   - the timeline updates with related records
   - the details panel updates correctly
   - the suspicious score is displayed
6. Check that records from different sources appear correctly in the investigation flow.
7. Confirm that loading, empty, and error states appear correctly when needed.

## Technical Notes
- Data is fetched from multiple Jotform forms.
- Different form submissions are normalized into one shared format.
- The suspicious score is heuristic-based and intentionally explainable.
- Different record types contribute differently to the score.
- The project focuses on making fragmented records easier to inspect and relate.

## Challenge Note
The purpose of this project is not only to fetch data, but to transform fragmented investigation data into a more usable and inspection-friendly interface.

The main goal is to help the user identify meaningful relationships between people, locations, events, and suspicious signals in a simple but effective dashboard experience.

# 🚀 Challenge Duyurusu

## 📅 Tarih ve Saat
Cumartesi günü başlama saatinden itibaren üç saattir.

## 🎯 Challenge Konsepti
Bu challenge'da, size özel hazırlanmış bir senaryo üzerine web uygulaması geliştirmeniz istenecektir. Challenge başlangıcında senaryo detayları paylaşılacaktır. Katılımcılar, verilen GitHub reposunu fork ederek kendi geliştirme ortamlarını oluşturacaklardır.

## 📦 GitHub Reposu
Challenge için kullanılacak repo: https://github.com/cemjotform/2026-frontend-challenge-ankara

## 🛠️ Hazırlık Süreci
1. GitHub reposunu fork edin
2. Tercih ettiğiniz framework ile geliştirme ortamınızı hazırlayın
3. Hazırladığınız setup'ı fork ettiğiniz repoya gönderin

## 💡 Önemli Notlar
- Katılımcılar kendi tercih ettikleri framework'leri kullanabilirler
