import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiOperation, ApiBody, ApiParam, ApiOkResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiNotFoundResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { Model, Types } from 'mongoose';
import { InspirationCreateDTO } from 'src/entities/inspiration/create-inspiration';
import { InspirationEditDTO } from 'src/entities/inspiration/edit-inspiration';
import { Inspiration } from 'src/entities/inspiration/inspiration';
import { InspirationReadResponse } from 'src/entities/inspiration/read-inspiration';
import { respondingClosePast } from '../calendar/calendarMocks';


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
  @ApiOkResponse({ description: 'List of inspirations organized by type', type: InspirationReadResponse })
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
      "posting": [],
      "responding": [],
      "synthesizing": []
    }

    const types = ["posting", "responding", "synthesizing"];

    for await (const type of types) {
      const aggregation = [];
      // Group by the unique elements
      aggregation.push(
        {
          $match: { type: type }
        },
        {
          $unwind: { path: "$subcats", preserveNullAndEmptyArrays: true }
        },
        {
          $group: {
            _id: "$subcats",
            values: {
              $addToSet: { _id: "$_id", name: "$name", instructions: "$instructions", outline: "$outline", icon: "$icon" }
            }
          }
        },
        {
          $project: { cat: "$_id", values: "$values", _id: 0 }
        }
      );

      let vals = await this.inspirationModel.aggregate(aggregation);

      if (subcats) {
        if (!Array.isArray(subcats)) {
          subcats = !!subcats ? [subcats] : [];
        }
        vals = vals.filter(val => {
          if (subcats.includes(val.cat)) {
            return val;
          }
        });
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