# workcenter-view

Work Center: очередь задач, распознавание, document pipeline. View id: **`workcenter`**.

`WorkCenterManager` + adopted styles (счётчик потребителей: закрытие одного окна не снимает стили с другого). Хост-артефакт `/workcenter` собирает [`apps/CWSP-process`](../../../apps/CWSP-process/README.md).

## Запуск

```bash
cd modules/views/workcenter-view
npm run dev
npm run build
```
