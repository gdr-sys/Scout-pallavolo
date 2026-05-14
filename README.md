# Volleyball Scout

Volleyball Scout è un'applicazione web single-page progettata per la rilevazione statistica avanzata durante le competizioni di pallavolo. Lo strumento permette agli operatori di monitorare le prestazioni dei singoli atleti e della squadra in tempo reale attraverso un'interfaccia ottimizzata per l'input rapido.

## About

Il progetto nasce per offrire una soluzione tecnica gratuita e portatile per lo scouting della pallavolo. L'applicazione opera interamente nel browser dell'utente, garantendo velocità di inserimento e persistenza dei dati senza necessità di database complessi, grazie all'utilizzo del LocalStorage.

L'architettura del software si basa su tre pilastri fondamentali:
* **Immediatezza Operativa**: La gestione dei punti e delle azioni è strutturata per ridurre al minimo il numero di tocchi necessari per registrare un evento.
* **Analisi Granulare**: Ogni fondamentale viene valutato su una scala a quattro livelli (++, +, –, =) per fornire una visione oggettiva dell'efficacia di gioco.
* **Portabilità dei Dati**: La possibilità di esportare in formati standard (PDF e CSV) assicura che i dati raccolti possano essere condivisi o elaborati in software di analisi esterni.

## Funzionalità Principali

* **Gestione Rose (Roster)**: Sistema per la creazione di squadre personalizzate con nomi, numeri di maglia e ruoli.
* **Scouting in Tempo Reale**: Inserimento rapido per Attacco, Difesa, Muro, Battuta e Ricezione con supporto alla correzione errori tramite funzione Undo.
* **Tabellone Punteggio**: Monitoraggio integrato del punteggio della partita per casa e ospite.
* **Log delle Azioni**: Cronologia delle azioni registrate visibile nella schermata principale per un controllo immediato.
* **Analisi Statistica**: Calcolo automatico di totali, percentuali di efficienza e positività per ogni giocatore.
* **Esportazione Report**: Generazione di file PDF professionali e file CSV per l'archiviazione digitale.

## Requisiti Tecnici

L'applicazione è contenuta in un singolo file HTML autonomo.
* **Dipendenze Esterne**: Utilizza le librerie jsPDF e jsPDF-AutoTable via CDN per la generazione dei documenti.
* **Archiviazione**: I dati delle rose e delle partite sono salvati localmente tramite l'API LocalStorage del browser.

## Guida all'Utilizzo

1. **Configurazione**: Accedere alla sezione Rosa per creare una squadra e aggiungere i giocatori.
2. **Inizio Partita**: Dalla Home, inserire i dettagli della gara e caricare la rosa desiderata.
3. **Rilevazione**: Selezionare il giocatore sulla sinistra e premere il tasto corrispondente alla qualità dell'azione eseguita.
4. **Esportazione**: Consultare le schede Stats e Riepilogo per scaricare i report finali in formato CSV o PDF.

## Licenza

Questo software è distribuito per scopi tecnici e sportivi. Consultare il codice sorgente per i dettagli sulla gestione dei dati locali.
