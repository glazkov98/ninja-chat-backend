import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as path from 'path';
import * as fs from 'fs';
import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";

const SWAGGER_URL = 'api-doc';

const documentSave = (document) => {
  const docPath = path.resolve('assets/swaggerDoc.json');
  try {
    if (!fs.existsSync(docPath)) {
      fs.closeSync(fs.openSync(docPath, 'w'));
    }
    fs.writeFileSync(docPath, JSON.stringify(document, null, '  '));
  } catch (e) {
    Logger.error('error on creating swagger', e, 'SWAGGER');
  }
  Logger.log(`document save on ${docPath}`, 'SWAGGER');
};

export function SwaggerStart(app: INestApplication, port) {
  const options = new DocumentBuilder()
    .setTitle('NINJA CHAT API')
    .setDescription(``)
    .addServer(`https://ninjachat.sntgog.ddns.net/`, 'dev server')
    .addServer(`http://localhost:${port}/`, 'dev server')
    .setVersion('1.0')
    .addTag('NinjaChat')
    .addBearerAuth()
    .build();

  const doc = SwaggerModule.createDocument(app, options);
  documentSave(doc);
  Logger.verbose(
    `swagger: http://localhost:${port}/${SWAGGER_URL}/`,
    'SWAGGER',
  );
  SwaggerModule.setup(SWAGGER_URL, app, doc);
  return SWAGGER_URL;
}
