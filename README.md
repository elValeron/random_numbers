# random_numbers

- Random Numbers - сервис для работы со случайными числами.



## Стэк
go_service написан на golang 1.23, с использованием библиотек: 
    1. Работа с контрактами protobuf:
        - google.protobuf 
        - google.grpc
    2. Работа с бд:
        - gorm
        - gorm/driver/postgres

js_service написан на JavaScript 22.11.0 с спользованием библиотек:
    1. Работа с API:
        - express
        - body_parser
    2. Работа с grpc:
        - grpc/grpc-js
        - grpc/proto-loader
    3. Тестирование: 
        - jest
        - supertest

## Для начала работы: 
    1. Клонировать репозиторий: 
        ```
        git clone https://github.com/elValeron/random_numbers
        ```
    2. Добавить переменные окружения для подлкючения к БД:
        ```
        export DB_USER=<Имя пользователя БД>
        export DB_PASSWORD=<Пароль для подключения пользователя в БД>
        export DB_NAME=<Имя БД>
        export DB_HOST=<Хост по которому доступна БД>*
        export DB_PORT=<Порт БД по которому доступна БД>
        ```
    * При запуске docker-compose.yaml без изменений, BD_HOST указать как db
   3. Запустить docker compose в detach режиме командой:
        ```
        make up
        ```

## API
### 1. POST 
### /random-numbers
    Возвращает maxNumber и список сгенерированных случайных чисел от 1 до maxNumber, данные вносятся в БД на стороне сервера поля:
    1. Request:
        1. "len" - Обязательное поле, длина списка случайных чисел
        2. "maxNumber" - Обязательное поле, максимальное значение случайного число
    
    2. Response:
        "maxNumber" - Максимальное значение случайного число
        "randomNumbers" - Список случайных чисел длинной len от 1 до maxNumber
    Request:
    ```
    {
        "len": 5,
        "maxNumber": 23
    }
    ```
    Response:
    ```
    {
        "maxNumber": 23,
        "randomNumbers": [
            2,
            15,
            14,
            18,
            17
        ]
    }
    ```
    
### 2. GET
### /averages?limit=<num>&offset=<num>
    
    1. Request:
    Body:
        1. "startDate" - Обязательное поле, начальная дата периода выборки. Формат "dd.mm.yyyy" или ISO8061 с милисекудами
        2. "endDate" - Не обязательное поле, конечная дата периода выборки, в случае если поля нет в запросе, выборка будет произведена от startDate до текущей даты. Формат "dd.mm.yyyy" или ISO8061 с милисекудами.
    Request params:
        1. limit - Целое число, не обязательный параметр, ограничивает результат запроса. По умолчанию равен 100
        2. offset - Целое число, не обязательный параметр, сдвигает запрос на n значений. По умолчанию равен 0
    Пример: 
    Request:
    ```
    {
        "startDate": "01.12.2024",
        "endDate": "2024-12-06T18:31:42.201Z"
    }
    ```
    Response:
    ```
        {
            "9": 4,
            "12": 7.4,
            "13": 8.3,
            "14": 8.9,
            "17": 7,
            "23": 13,
            "24": 12,
            "34": 15,
            "35": 11
        }
    ```

