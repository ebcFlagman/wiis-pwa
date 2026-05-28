Feature: Punkte eingeben (WRITE-Modus)
  Beim Spielen werden die Punkte korrekt auf beide Teams verteilt.

  Background:
    Given die App ist geöffnet

  Scenario: Team 1 gibt 100 Punkte ein mit Multiplikator 1
    When ich auf Team 1 tippe
    And ich "💯 Punkte eingeben" auswähle
    And ich "100" eintippe
    And ich auf "Weiter" tippe
    And ich Multiplikator "×1" wähle
    Then zeigt Team 1 "100" Punkte
    And zeigt Team 2 "57" Punkte

  Scenario: Team 2 gibt 80 Punkte ein mit Multiplikator 2
    When ich auf Team 2 tippe
    And ich "💯 Punkte eingeben" auswähle
    And ich "80" eintippe
    And ich auf "Weiter" tippe
    And ich Multiplikator "×2" wähle
    Then zeigt Team 2 "160" Punkte
    And zeigt Team 1 "154" Punkte
