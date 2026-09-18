# STABILITY CONTRACT

## Runtime-stable baseline
- Branch: `stable-runtime-v0.4.1`
- Commit: `06ed664eb289312c393eb9952985456057d77584`
- This remains the authoritative recovery point.

## Current development candidate
- Version: **0.4.2 RC**
- Branch: `rc-v0.4.2-composition-studio-engine`
- Purpose: exactly one functional change over v0.4.1: the Composition Studio two-stage composition procedure.
- Stage 1 uses the Composition Studio v0.5.15 free-composition prompt.
- Stage 2 is a faithful notation/MIDI translation step. It keeps Minimal Composer's existing technical output contract unchanged rather than importing Composition Studio's REAPER-specific CS format.
- Player, SoundFont, test-series storage/export, provider selection, and composition-idea display remain the v0.4.1 implementation.

## Promotion rule
0.4.2 remains RC until the user has tested the real web app and confirmed that a composition completes, produces playable MIDI, and the musical result reflects the intended two-stage procedure. CI/syntax success alone is not sufficient.

## Binding rules
1. Runtime-confirmed code outranks documentation and chat memory.
2. No patch chains.
3. One controlled functional change per recovery step.
4. On failure, return to `stable-runtime-v0.4.1`.
5. Do not promote experimental v0.5/v0.6 history into this recovery line.
