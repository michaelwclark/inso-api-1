import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { DiscussionReadDTO } from './entities/discussion/read-discussion';
import { read } from 'fs';
//import { GradeService } from './modules/grade/grade.service';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true
    })
  );

  
  const config = new DocumentBuilder()
    .setTitle('Inso API')
    .setDescription('API for Inso system')
    .setVersion('0.0')
    .addTag('Routes')
    .build();
    
  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true
  });
  SwaggerModule.setup('api', app, document);
  
  app.enableCors();

  app.use(helmet());
  
  await app.listen(process.env.PORT);

  // go through all discussions in the db and find the ones that have a close date after today
  const discussions = this.DiscussionService.returnAllDiscussions()
  .populate('facilitators', ['f_name', 'l_name', 'email', 'username'])
  .populate('poster', ['f_name', 'l_name', 'email', 'username'])
  .populate({ path: 'settings', populate: [{ path: 'calendar'}, { path: 'score'}, { path: 'post_inspirations'}]}).lean();

  discussions.forEach(element => {
    var readDiscussion = new DiscussionReadDTO(element);
    var data = {
      discussionId: readDiscussion._id,
      closeDate: readDiscussion.settings.calendar.close
    }
    this.GradeService.addEventForAutoGrading(data);
  })

  // Use the node scheduler to add each close as an event in the queue 
  //this.GradeService.addEventForAutoGrading();
  

}
bootstrap();
