Feature: Weisen (CLAIM-Modus)
  Beim Weisen erhält nur das spielende Team Punkte, das Gegnerteam bekommt nichts.

  Background:
    Given die App ist geöffnet

  Scenario: Team 1 weist 50 Punkte mit Rosen (×1)
    When ich auf Team 1 tippe
    And ich "✋ Weisen" auswähle
    And ich Trumpf "Rosen" wähle
    And ich "50" Punkte wähle
    Then zeigt Team 1 "50" Punkte
    And zeigt Team 2 "0" Punkte

  Scenario: Team 2 weist 20 Punkte mit Obenabe (×3)
    When ich auf Team 2 tippe
    And ich "✋ Weisen" auswähle
    And ich Trumpf "Obenabe" wähle
    And ich "20" Punkte wähle
    Then zeigt Team 2 "60" Punkte
    And zeigt Team 1 "0" Punkte
