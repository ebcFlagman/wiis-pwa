Feature: Match-Scoring
  Ein Match gibt einem Team 257 Punkte, das Gegnerteam erhält nichts.

  Background:
    Given die App ist geöffnet

  Scenario: Team 1 spielt ein Match mit Rosen (×1)
    When ich auf Team 1 tippe
    And ich "💥 Match (257)" auswähle
    And ich Trumpf "Rosen" wähle
    Then zeigt Team 1 "257" Punkte
    And zeigt Team 2 "0" Punkte

  Scenario: Team 2 spielt ein Match mit Schälle (×2)
    When ich auf Team 2 tippe
    And ich "💥 Match (257)" auswähle
    And ich Trumpf "Schilten" wähle
    Then zeigt Team 2 "514" Punkte
    And zeigt Team 1 "0" Punkte
