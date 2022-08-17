import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
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
  @UseGuards(JwtAuthGuard)
  @ApiTags('Inspiration')
  async getInspirations(@Query('type') type: string): Promise<InspirationReadResponse> {
    const postingVals = await this.inspirationModel.find({ type: 'posting'});
    const posting = {
      "ask_something": {
        category: 'Ask Something',
        categoryIcon: '',
        inspirations: []
      },
      "connect_something": { 
        category: 'Connect Something',
        categoryIcon: '',
        inspirations: []
      },
      "create_something": {
        category: 'Create Something',
        categoryIcon: '',
        inspirations: []
      },
      "share_something": { 
        category: 'Share Something',
        categoryIcon: '',
        inspirations: []
      },
      "start_something": { 
        category: 'Start Something',
        categoryIcon: '',
        inspirations: []
      }
    };
    postingVals.forEach(inspo => {
      if(inspo.subCat === 'ask_something') {
        if(posting.ask_something.categoryIcon === '') {
          posting.ask_something.categoryIcon = inspo.icon;
        }
        posting.ask_something.inspirations.push(inspo);
      }
      if(inspo.subCat === 'connect_something') {
        if(posting.connect_something.categoryIcon === '') {
          posting.connect_something.categoryIcon = inspo.icon;
        }
        posting.connect_something.inspirations.push(inspo);
      }
      if(inspo.subCat === 'create_something') {
        if(posting.create_something.categoryIcon === '') {
          posting.create_something.categoryIcon = inspo.icon;
        }
        posting.create_something.inspirations.push(inspo);
      }
      if(inspo.subCat === 'share_something') {
        if(posting.share_something.categoryIcon === '') {
          posting.share_something.categoryIcon = inspo.icon;
        }
        posting.share_something.inspirations.push(inspo);
      }
      if(inspo.subCat === 'start_something') {
        if(posting.start_something.categoryIcon === '') {
          posting.start_something.categoryIcon = inspo.icon;
        }
        posting.start_something.inspirations.push(inspo);
      }
    });


    const respondingVals = await this.inspirationModel.find({ type: 'responding'});
    const responding = {
      "add": {
        category: "Add",
        categoryIcon: '',
        inspirations: []
      },
      "answer": {
        category: "Answer",
        categoryIcon: '',
        inspirations: []
      },
      "ask": {
        category: "Ask",
        categoryIcon: '',
        inspirations: []
      },
      "evaluate": {
        category: "Evaluate",
        categoryIcon: '',
        inspirations: []
      },
      "react": {
        category: "React",
        categoryIcon: '',
        inspirations: []
      }
    }
    respondingVals.forEach(inspo => {
      if(inspo.subCat === 'add') {
        if(responding.add.categoryIcon === '') {
          responding.add.categoryIcon = inspo.icon;
        }
        responding.add.inspirations.push(inspo);
      }
      if(inspo.subCat === 'answer') {
        if(responding.answer.categoryIcon === '') {
          responding.answer.categoryIcon = inspo.icon;
        }
        responding.answer.inspirations.push(inspo)
      }
      if(inspo.subCat === 'ask') {
        if(responding.ask.categoryIcon === '') {
          responding.ask.categoryIcon = inspo.icon;
        }
        responding.ask.inspirations.push(inspo);
      }
      if(inspo.subCat === 'evaluate') {
        if(responding.evaluate.categoryIcon === '') {
          responding.evaluate.categoryIcon = inspo.icon;
        }
        responding.evaluate.inspirations.push(inspo);
      }
      if(inspo.subCat === 'react') {
        if(responding.react.categoryIcon === '') {
          responding.react.categoryIcon = inspo.icon;
        }
        responding.react.inspirations.push(inspo);
      }
    })
    const synthesizingVals = await this.inspirationModel.find({ type: 'synthesizing'});
    const synthesizing = {
      "connections": {
        category: "Connections",
        categoryIcon: '',
        inspirations: []
      },
      "tags": {
        category: "Tags",
        categoryIcon: '',
        inspirations: []
      },
      "threads": {
        category: "Threads",
        categoryIcon: '',
        inspirations: []
      }
    }
    synthesizingVals.forEach(inspo => {
      if(inspo.subCat === 'connections') {
        if(synthesizing.connections.categoryIcon === '') {
          synthesizing.connections.categoryIcon = inspo.icon;
        }
        synthesizing.connections.inspirations.push(inspo);
      }
      if(inspo.subCat === 'tags') {
        if(synthesizing.tags.categoryIcon === '') {
          synthesizing.tags.categoryIcon = inspo.icon;
        }
        synthesizing.tags.inspirations.push(inspo);
      }
      if(inspo.subCat === 'threads') {
        if(synthesizing.threads.categoryIcon === '') {
          synthesizing.threads.categoryIcon = inspo.icon;
        }
        synthesizing.threads.inspirations.push(inspo);
      }
    });
    const postingReturn = [];
    const respondingReturn = [];
    const synthesizingReturn = [];

    for (const property in posting) {
      postingReturn.push(posting[property]);
    }
    for (const property in responding) {
      respondingReturn.push(responding[property]);
    }
    for(const property in synthesizing) {
      synthesizingReturn.push(synthesizing[property]);
    }
    return { 
      posting: postingReturn, 
      responding: respondingReturn,
      synthesizing: synthesizingReturn
    };
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