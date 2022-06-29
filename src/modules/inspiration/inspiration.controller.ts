import { Body, Controller, HttpException, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiOperation, ApiBody, ApiParam, ApiOkResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import { Model } from 'mongoose';
import { InspirationCreateDTO } from 'src/entities/inspiration/create-inspiration';
import { InspirationEditDTO } from 'src/entities/inspiration/edit-inspiration';
import { Inspiration } from 'src/entities/inspiration/inspiration';


@Controller()
export class InspirationController {
  constructor(
    @InjectModel(Inspiration.name) private inspirationModel: Model<Inspiration>,
  ) {}

  @Post('inspiration')
  @ApiOperation({description: 'Create an inspiration for a discussion'})
  @ApiBody({description: '', type: Object})
  @ApiParam({name: '', description: ''})
  @ApiOkResponse({ description: ''})
  @ApiBadRequestResponse({ description: ''})
  @ApiUnauthorizedResponse({ description: ''})
  @ApiNotFoundResponse({ description: ''})
  @ApiTags('Inspiration')
  async createInspiration(@Body() inspiration: InspirationCreateDTO): Promise<Inspiration> {
    const createdInspiration = new this.inspirationModel(inspiration);
    return await createdInspiration.save();
  }

  @Patch('inspiration/:inspirationId')
  @ApiOperation({description: ''})
  @ApiBody({description: '', type: Object})
  @ApiParam({name: '', description: ''})
  @ApiOkResponse({ description: ''})
  @ApiBadRequestResponse({ description: ''})
  @ApiUnauthorizedResponse({ description: ''})
  @ApiNotFoundResponse({ description: ''})
  @ApiTags('Inspiration')
  async updateInspiration(@Param('inspirationId') inspirationId: string, @Body() inspiration: InspirationEditDTO): Promise<any> {
    const foundInspiration = await this.inspirationModel.findOne({ _id: inspirationId });
    if(!foundInspiration) {
      throw new HttpException('The inspiration does not exist', HttpStatus.NOT_FOUND);
    }
    return await this.inspirationModel.findOneAndUpdate({_id: inspirationId}, inspiration);
  }
}