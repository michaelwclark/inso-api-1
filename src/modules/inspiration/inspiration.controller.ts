import { Controller, Get, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
//import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { Model } from 'mongoose';
import { Inspiration } from 'src/entities/inspiration/inspiration';
import { InspirationReadResponse } from 'src/entities/inspiration/read-inspiration';

@Controller()
export class InspirationController {
  constructor(
    @InjectModel(Inspiration.name) private inspirationModel: Model<Inspiration>,
  ) { }

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
  @ApiOperation({ description: 'Gets all valid inspirations on the system' })
  @ApiOkResponse({
    description: 'List of inspirations organized by type',
    type: InspirationReadResponse,
  })
  @ApiUnauthorizedResponse({ description: 'The user is not logged in' })
  //@UseGuards(JwtAuthGuard)
  @ApiQuery({
    name: 'subcats',
    required: false,
    description: 'An array of subcats to return',
  })
  @ApiTags('Inspiration')
  async getInspirations(@Query('subcats') subcats: string[]): Promise<any> {
    const returnVal = {
      posting: [],
      responding: [],
      synthesizing: [],
    };

    const types = ['posting', 'responding', 'synthesizing'];

    for await (const type of types) {
      const aggregation = [];
      // Group by the unique elements
      aggregation.push(
        {
          $match: { type: type },
        },
        {
          $unwind: { path: '$subcats', preserveNullAndEmptyArrays: true },
        },
        {
          $group: {
            _id: '$subcats',
            values: {
              $addToSet: {
                _id: '$_id',
                name: '$name',
                instructions: '$instructions',
                outline: '$outline',
                icon: '$icon',
                topicOrder: '$topicOrder',
                debateOrder: '$debateOrder',
                peerReviewOrder: '$peerReviewOrder',
                testPrepOrder: '$testPrepOrder',
                testReviewOrder: '$testReviewOrder',
                caseStudyOrder: '$caseDesignOrder',
                designThinkingOrder: '$designThinkingOrder'
              },
            },
          },
        },
        {
          $project: { cat: '$_id', values: '$values', _id: 0 },
        },
      );

      let vals = await this.inspirationModel.aggregate(aggregation);
      if (subcats) {
        if (!Array.isArray(subcats)) {
          subcats = !!subcats ? [subcats] : [];
        }
        vals = vals.filter((val) => {
          if (subcats.includes(val.cat)) {
            return val;
          }
        });
      }
      if (type === "posting" || type === "responding") {
        vals.forEach(val => {
          if (val.cat === 'topic') {
            val.values.sort(function (a, b) { return (a.topicOrder > b.topicOrder) ? 1 : ((b.topicOrder > a.topicOrder) ? -1 : 0); });
          }
          if (val.cat === 'debate') {
            val.values.sort(function (a, b) { return (a.debateOrder > b.debateOrder) ? 1 : ((b.debateOrder > a.debateOrder) ? -1 : 0); });
          }
          if (val.cat === 'peerReview') {
            val.values.sort(function (a, b) { return (a.peerReviewOrder > b.peerReviewOrder) ? 1 : ((b.peerReviewOrder > a.peerReviewOrder) ? -1 : 0); });
          }
          if (val.cat === 'testPrep') {
            val.values.sort(function (a, b) { return (a.testPrepOrder > b.testPrepOrder) ? 1 : ((b.testPrepOrder > a.testPrepOrder) ? -1 : 0); });
          }
          if (val.cat === 'testReview') {
            val.values.sort(function (a, b) { return (a.testReviewOrder > b.testReviewOrder) ? 1 : ((b.testReviewOrder > a.testReviewOrder) ? -1 : 0); });
          }
          if (val.cat === 'caseStudy') {
            val.values.sort(function (a, b) { return (a.caseStudyOrder > b.caseStudyOrder) ? 1 : ((b.caseStudyOrder > a.caseStudyOrder) ? -1 : 0); });
          }
          if (val.cat === 'designThinking') {
            val.values.sort(function (a, b) { return (a.designThinkingOrder > b.designThinkingOrder) ? 1 : ((b.designThinkingOrder > a.designThinkingOrder) ? -1 : 0); });
          }

        })
      }

      returnVal[type] = vals;
    }

    return returnVal;
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
