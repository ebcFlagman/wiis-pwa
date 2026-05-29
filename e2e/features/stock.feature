Feature: Stöck (STOCK-Modus)
  Stöck ist König + Dame im Trumpf und gibt dem spielenden Team 20 Punkte (× Multiplikator).
  Das Gegnerteam bekommt nichts, und die Runde wird nicht vorangeschritten.

  Background:
    Given die App ist geöffnet

  Scenario: Team 1 weist Stöck mit Rosen (×1)
    When ich auf Team 1 tippe
    And ich "✋ Weisen" auswähle
    And ich Trumpf "Rosen" wähle
    And ich wähle Stöck
    Then zeigt Team 1 "20" Punkte
    And zeigt Team 2 "0" Punkte

  Scenario: Team 2 weist Stöck mit Obenabe (×3)
    When ich auf Team 2 tippe
    And ich "✋ Weisen" auswähle
    And ich Trumpf "Obenabe" wähle
    And ich wähle Stöck
    Then zeigt Team 2 "60" Punkte
    And zeigt Team 1 "0" Punkte
