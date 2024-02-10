# WebOS
> Just for fun

Мини-приложение которое симулирует операционную систему.
Сделано ради прикола 3 года назад.

Попробовать можно [здесь](https://levkopo.github.io/webos/).

# Пакеты
Все пакеты хранятся в папке packages. При запуске приложения
все пакеты загружаются в папку /bin в виртуальной памяти (localStorage).

Список предустановленых пакетов
|Имя пакета|Назначение|Пример использования|
|---|---|---|
|`cat`|Вывод файла в консоль| `cat /bin/cat`|
|`cd`|Переход в папку|`cd /bin`|
|`echo`|Вывод текста в консоль|`echo Hello, World!`|
|`js`|Выполнение кода js (буквально eval)|`js alert('Hi!')`|
|`ls`|Вывод папок и файлов по текущему пути в консоль|`ls /bin`/`ls`|
|`rm`|Удалить файл/папку|`rm /bin/rm`|
|`sh`|Запустить консоль|`sh`|
|`touch`|Создать новый пустой файл|`touch /bin/newcmd`|
|`write`|Записать текст в файл|`write /bin/newcmd alert('Hi!')`|
|`wui`|Запуск мини-оболочки WebUI|`wui`|

# Базовое API для пакетов

## Работа с файловой системой
`removeFile(path): void` - удаление файла
`createFile(path): void` - создание файла
`getFile(path): string?` - чтение файла
`getFileContentArrayBuffer(path): Uint8Array?` - чтение файла в виде байтов

## UI
```
Window(drawer: (api: {
    setInfo(info: {title: string?})
    draw(html: string)
    nextChar(): Promise<string|null>
})
```

## Other
`Base64.encode(str): string`
`Base64.encodeArrayBuffer(buffer): Promise<string>`
`escapeHTML(text): string`
`sleep(ms): Promise<void>`




```
Я не знаю зачем я это расписал но пусть будет :D
```

