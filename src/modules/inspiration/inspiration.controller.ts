import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiOperation, ApiBody, ApiParam, ApiOkResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import { Model, Types } from 'mongoose';
import { InspirationCreateDTO } from 'src/entities/inspiration/create-inspiration';
import { InspirationEditDTO } from 'src/entities/inspiration/edit-inspiration';
import { Inspiration } from 'src/entities/inspiration/inspiration';
import { InspirationReadResponse } from 'src/entities/inspiration/read-inspiration';


@Controller()
export class InspirationController {
  constructor(
    @InjectModel(Inspiration.name) private inspirationModel: Model<Inspiration>,
  ) {}

  // @Post('inspiration')
  // @ApiOperation({description: 'Create an inspiration for a discussion'})
  // @ApiBody({description: 'Inspiration to create', type: InspirationCreateDTO})
  // @ApiOkResponse({ description: 'Inspiration created!'})
  // @ApiBadRequestResponse({ description: ''})
  // @ApiUnauthorizedResponse({ description: ''})
  // @ApiNotFoundResponse({ description: ''})
  // @ApiTags('Inspiration')
  // async createInspiration(@Body() inspiration: InspirationCreateDTO): Promise<Inspiration> {
  //   const createdInspiration = new this.inspirationModel(inspiration);
  //   return await createdInspiration.save();
  // }

  @Get('inspirations')
  @ApiOperation({description: 'Gets all valid inspirations on the system'})
  @ApiOkResponse({ description: 'List of inspirations organized by type', type: InspirationReadResponse })
  @ApiUnauthorizedResponse({ description: ''})
  //@UseGuards(JwtAuthGuard)
  @ApiTags('Inspiration')
  async getInspirations(): Promise<InspirationReadResponse> {
    const postingVals = await this.inspirationModel.find({ type: 'posting'});
    const posting = { 
      "ask_something": [],
      "connect_something": [],
      "create_something": [],
      "share_something": [],
      "start_something": []

    }
    postingVals.forEach(inspo => {
      if(inspo.subCat === 'ask_something') {
        posting.ask_something.push(inspo);
      }
      if(inspo.subCat === 'connect_something') {
        posting.connect_something.push(inspo);
      }
      if(inspo.subCat === 'create_something') {
        posting.create_something.push(inspo);
      }
      if(inspo.subCat === 'share_something') {
        posting.share_something.push(inspo);
      }
      if(inspo.subCat === 'start_something') {
        posting.start_something.push(inspo);
      }
    });


    const respondingVals = await this.inspirationModel.find({ type: 'responding'});
    const responding = {
      "add": [],
      "answer": [],
      "ask": [],
      "evaluate": [],
      "react": []
    }
    respondingVals.forEach(inspo => {
      if(inspo.subCat === 'add') {
        responding.add.push(inspo);
      }
      if(inspo.subCat === 'answer') {
        responding.answer.push(inspo)
      }
      if(inspo.subCat === 'ask') {
        responding.ask.push(inspo);
      }
      if(inspo.subCat === 'evaluate') {
        responding.evaluate.push(inspo);
      }
      if(inspo.subCat === 'react') {
        responding.react.push(inspo);
      }
    })
    const synthesizingVals = await this.inspirationModel.find({ type: 'synthesizing'});
    const synthesizing = {
      "connections": [],
      "tags": [],
      "threads": []
    }
    respondingVals.forEach(inspo => {
      if(inspo.subCat === 'connections') {
        synthesizing.connections.push(inspo);
      }
      if(inspo.subCat === 'tags') {
        synthesizing.tags.push(inspo);
      }
      if(inspo.subCat === 'threads') {
        synthesizing.threads.push(inspo);
      }
    })
    return { posting, responding, synthesizing };
  }

  // @Patch('inspiration/:inspirationId')
  // @ApiOperation({description: 'Update a post inspiration'})
  // @ApiBody({description: 'The Inspiration to update', type: InspirationEditDTO})
  // @ApiParam({name: 'inspirationId', description: 'The id of the inspiration'})
  // @ApiOkResponse({ description: 'Inspiration updated!'})
  // @ApiBadRequestResponse({ description: 'Inspiration Id is invalid'})
  // @ApiUnauthorizedResponse({ description: ''})
  // @ApiNotFoundResponse({ description: ''})
  // @ApiTags('Inspiration')
  // async updateInspiration(@Param('inspirationId') inspirationId: string, @Body() inspiration: InspirationEditDTO): Promise<any> {
  //   if(!Types.ObjectId.isValid(inspirationId)) {
  //     throw new HttpException('The inspirationId is not valid', HttpStatus.BAD_REQUEST);
  //   }
  //   const foundInspiration = await this.inspirationModel.findOne({ _id: inspirationId });
  //   if(!foundInspiration) {
  //     throw new HttpException('The inspiration does not exist', HttpStatus.NOT_FOUND);
  //   }
  //   return await this.inspirationModel.findOneAndUpdate({_id: inspirationId}, inspiration);
  // }

  // @Delete('inspiration/:inspirationId')
  // @ApiOperation({description: 'Deletes a specified inspiration'})
  // @ApiParam({name: 'inspirationId', description: 'The id of the inspiration that needs to be added'})
  // @ApiOkResponse({ description: 'Inspiration Deleted'})
  // @ApiBadRequestResponse({ description: ''})
  // @ApiUnauthorizedResponse({ description: ''})
  // @ApiNotFoundResponse({ description: ''})
  // @ApiTags('Inspiration')
  // async deleteInspiration(@Param('inspirationId') inspirationId: string): Promise<any> {
  //   if(!Types.ObjectId.isValid(inspirationId)) {
  //     throw new HttpException('The inspirationId is not valid', HttpStatus.BAD_REQUEST);
  //   }
  //   const foundInspiration = await this.inspirationModel.findOne({ _id: inspirationId });
  //   if(!foundInspiration) {
  //     throw new HttpException('The inspiration does not exist', HttpStatus.NOT_FOUND);
  //   }
  //   return await this.inspirationModel.findOneAndDelete({_id: new Types.ObjectId(inspirationId)});
  // }
}