Feature: Rückgängig und Spielende

  Background:
    Given die App ist geöffnet

  Scenario: Letzte Punkte rückgängig machen
    When ich auf Team 1 tippe
    And ich "💯 Punkte eingeben" auswähle
    And ich "100" eintippe
    And ich auf "Weiter" tippe
    And ich Multiplikator "×1" wähle
    And ich auf Team 1 tippe
    And ich "↩ Rückgängig" auswähle
    Then zeigt Team 1 "0" Punkte
    And zeigt Team 2 "0" Punkte

  Scenario: Neues Spiel zurücksetzen
    When ich auf Team 1 tippe
    And ich "💯 Punkte eingeben" auswähle
    And ich "100" eintippe
    And ich auf "Weiter" tippe
    And ich Multiplikator "×1" wähle
    And ich auf Team 1 tippe
    And ich "🔄 Neues Spiel" auswähle
    And ich auf "Zurücksetzen" tippe
    Then zeigt Team 1 "0" Punkte
    And zeigt Team 2 "0" Punkte

  Scenario: Spiel endet wenn Ziel erreicht wird
    Given das Ziel ist auf 257 Punkte gesetzt
    When ich auf Team 1 tippe
    And ich "💥 Match (257)" auswähle
    And ich Multiplikator "×1" wähle
    Then wird "Spiel beendet!" angezeigt
    And der Gewinner ist "Spieler 1 / Spieler 2"
