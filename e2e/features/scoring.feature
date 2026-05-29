Feature: Punkte eingeben (WRITE-Modus)
  Beim Spielen werden die Punkte korrekt auf beide Teams verteilt.

  Background:
    Given die App ist geöffnet

  Scenario: Team 1 gibt 100 Punkte ein mit Rosen (×1)
    When ich auf Team 1 tippe
    And ich "💯 Punkte eingeben" auswähle
    And ich Trumpf "Rosen" wähle
    And ich "100" eintippe
    And ich auf "Weiter" tippe
    Then zeigt Team 1 "100" Punkte
    And zeigt Team 2 "57" Punkte

  Scenario: Team 2 gibt 80 Punkte ein mit Schälle (×2)
    When ich auf Team 2 tippe
    And ich "💯 Punkte eingeben" auswähle
    And ich Trumpf "Schilten" wähle
    And ich "80" eintippe
    And ich auf "Weiter" tippe
    Then zeigt Team 2 "160" Punkte
    And zeigt Team 1 "154" Punkte
