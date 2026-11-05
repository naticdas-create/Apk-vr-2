# MR Shell
Shell de realidade mista para Android: passthrough (câmera traseira) + hand tracking (MediaPipe) + UI presa à mão.

## Baixar o APK
1. Suba este projeto num repositório GitHub (branch `main`).
2. Aba **Actions** → *Build APK* roda sozinho (ou "Run workflow").
3. O APK fica em **Releases → MR Shell (último APK)** e em Artifacts. Baixe no celular e instale.

## Testar no PC/celular sem APK
`npm install && npm run prepare:web && npm run serve` (precisa de HTTPS ou localhost para a câmera).

## Estrutura
core/ camera · handTracking · gestures · math (quaternion) · animation · settings
ui/ handUI · pointer · windowManager · library · dock · settingsApp · apps
