# (DEV)
## Clean Architecture + Domain-Driven Design (DDD)
```
src/
 ┣ core/                              # 🔹 ชั้นธุรกิจหลัก (domain + use cases)
 ┃ ┣ entities/
 ┃ ┃ ┣ user.model.ts
 ┃ ┃ ┣ tweet.model.ts
 ┃ ┃ ┗ hashtag.model.ts
 ┃ ┣ use-cases/
 ┃ ┃ ┣ create-user.usecase.ts
 ┃ ┃ ┣ create-tweet.usecase.ts
 ┃ ┃ ┗ get-tweets.usecase.ts
 ┃ ┗ interfaces/
 ┃    ┣ users-repository.interface.ts
 ┃    ┣ tweet-repository.interface.ts
 ┃    ┗ hash-provider.interface.ts
 ┣ infrastructure/                    # 🔹 ส่วนที่ติดต่อกับระบบภายนอก
 ┃ ┣ database/
 ┃ ┃ ┣ entities/
 ┃ ┃ ┃ ┣ user.entity.ts
 ┃ ┃ ┃ ┣ tweet.entity.ts
 ┃ ┃ ┃ ┗ hashtag.entity.ts
 ┃ ┃ ┣ repositories/
 ┃ ┃ ┃ ┣ users.repository.ts
 ┃ ┃ ┃ ┗ tweet.repository.ts
 ┃ ┗ providers/
 ┃    ┗ hash/
 ┃       ┣ bcrypt.provider.ts
 ┃       ┗ index.ts
 ┣ modules/                           # 🔹 Presentation Layer (Controllers + Modules)
 ┃ ┣ auth/
 ┃ ┃ ┣ auth.controller.ts
 ┃ ┃ ┣ auth.service.ts
 ┃ ┃ ┣ auth.module.ts
 ┃ ┃ ┣ guards/
 ┃ ┃ ┃ ┗ authorize.guard.ts
 ┃ ┃ ┣ strategies/
 ┃ ┃ ┃ ┗ jwt.strategy.ts
 ┃ ┃ ┗ decorators/
 ┃ ┃    ┗ active-user.decorator.ts
 ┃ ┣ users/
 ┃ ┃ ┣ users.controller.ts
 ┃ ┃ ┣ users.service.ts
 ┃ ┃ ┗ users.module.ts
 ┃ ┣ tweet/
 ┃ ┃ ┣ tweet.controller.ts
 ┃ ┃ ┣ tweet.service.ts
 ┃ ┃ ┗ tweet.module.ts
 ┃ ┗ hashtag/
 ┃    ┣ hashtag.controller.ts
 ┃    ┣ hashtag.service.ts
 ┃    ┗ hashtag.module.ts
 ┣ common/                            # 🔹 ส่วนรวมใช้ (pipes, filters, interceptors)
 ┃ ┣ filters/
 ┃ ┃ ┗ http-exception.filter.ts
 ┃ ┣ interceptors/
 ┃ ┃ ┗ response.interceptor.ts
 ┃ ┣ dto/
 ┃ ┃ ┣ pagination.dto.ts
 ┃ ┃ ┗ index.ts
 ┃ ┣ constants/
 ┃ ┃ ┣ app.constant.ts
 ┃ ┃ ┗ metadata.constant.ts
 ┃ ┗ utils/
 ┃    ┣ pagination.provider.ts
 ┃    ┗ index.ts
 ┣ config/                            # 🔹 ค่าตั้งค่า (env, jwt, db)
 ┃ ┣ app.config.ts
 ┃ ┣ database.config.ts
 ┃ ┣ auth.config.ts
 ┃ ┗ env.validation.ts
 ┣ main.ts
 ┗ app.module.ts


 | Layer              | หน้าที่                                            |
| ------------------ | -------------------------------------------------- |
| **Domain**         | กำหนด Model และ Interface                          |
| **Use Case**       | รวม Pure Business Logic (ไม่ขึ้นกับ framework)          |
| **Infrastructure** | เชื่อมต่อของจริง (TypeORM, Bcrypt, JWT)            |
| **Modules (Nest)** | Controller / DI / Mapping ระหว่างโลกจริงกับ domain |
domain → usecase → repository → service → controller
```

```
### nest g resource auth --no-spec
### npm install --save @nestjs/typeorm typeorm
### npx nest g provider ./common/pagination --no-spec
### nest g pr ./auth/provider/hashing.provider --flat --no-spec
### ``
```
