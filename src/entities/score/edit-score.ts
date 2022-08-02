import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsDefined, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Length, ValidateIf, ValidateNested } from "class-validator";

export class EditAutoRequirements {

    @ApiProperty({
        name: 'max_points',
        description: 'The max number of points that can be earned for posts, active days, or comments',
        required: false,
        type: Number,
        isArray: false
    })
    @IsNumber()
    @IsDefined()
    @IsNotEmpty()
    public max_points: number;

    @ApiProperty({
        name: 'required',
        description: 'The required number of posts, active days, or comments received to get full points',
        required: false,
        type: Number,
        isArray: false
    })
    @IsNumber()
    @IsDefined()
    @IsNotEmpty()
    public required: number;

    constructor(partial: Partial<EditAutoRequirements>) {
        if(partial) {
            this.max_points = partial.max_points;
            this.required = partial.required;
        }
    }
}

export class EditPostInspirationOptions {

    @ApiProperty({
        name: 'selected',
        description: 'Boolean to determine if post inspirations are a factor in scoring',
        required: false,
        type: Boolean,
        isArray: false
    })
    @IsBoolean()
    @IsDefined()
    @IsNotEmpty()
    public selected: boolean;

    @ApiProperty({
        name: 'max_points',
        description: 'The maximum number of points for using post inspirations',
        required: false,
        type: Number,
        isArray: false,
    })
    @IsNumber()
    @IsDefined()
    @IsNotEmpty()
    public max_points: number;

    constructor(partial: Partial<EditPostInspirationOptions>) {
        if(partial) {
            this.selected = partial.selected;
            this.max_points = partial.max_points;
        }
    }
}

export class EditGradingCriteria {

    @ApiProperty({
        name: 'criteria',
        description: 'The criteria for the rubric portion',
        required: false,
        type: String,
        isArray: false,
        maxLength: 100
    })
    @IsOptional()
    @IsString()
    @IsDefined()
    @IsNotEmpty()
    @Length(2, 100)
    public criteria: string;

    @ApiProperty({
        name: 'max_points',
        description: 'The maximum number of points for the criteria',
        required: false,
        type: Number,
        isArray: false
    })
    @IsOptional()
    @IsNumber()
    @IsDefined()
    @IsNotEmpty()
    public max_points: number;

    constructor(partial: Partial<EditGradingCriteria>) {
        if(partial) {
            this.criteria = partial.criteria;
            this.max_points = partial.max_points;
        }
    }
}

export class ScoreEditDTO {
    @ApiProperty({
        name: 'type',
        description: 'Auto or Rubric',
        required: false,
        type: String,
        isArray: false
    })
    @IsNotEmpty()
    @IsString()
    @IsIn(['auto', 'rubric'])
    public type: string;

    @ApiProperty({
        name: 'total',
        description: 'The total number of points available for the discussion',
        required: false,
        type: Number,
        isArray: false
    })
    @IsNumber()
    @IsOptional()
    public total: number;

    @ApiProperty({
        name: 'posts_made',
        description: 'Requirements for posts_made which includes max points possible and the requirement to receive those',
        required: false,
        type: EditAutoRequirements,
        isArray: false
    })
    @ValidateIf(obj => obj.type === 'auto')
    @IsOptional()
    @ValidateNested()
    @Type(() => EditAutoRequirements)
    public posts_made: EditAutoRequirements;

    @ApiProperty({
        name: 'active_days',
        description: 'Requirements for active_days which includes max points possible and the requirement to receive those',
        required: false,
        type: EditAutoRequirements,
        isArray: false
    })
    @ValidateIf(obj => obj.type === 'auto')
    @IsOptional()
    @ValidateNested()
    @Type(() => EditAutoRequirements)
    public active_days: EditAutoRequirements;

    @ApiProperty({
        name: 'comments_received',
        description: 'Requirements for comments_received which includes max points possible and the requirement to receive those',
        required: false,
        type: EditAutoRequirements,
        isArray: false
    })
    @ValidateIf(obj => obj.type === 'auto')
    @IsOptional()
    @ValidateNested()
    @Type(() => EditAutoRequirements)
    public comments_received: EditAutoRequirements;

    @ApiProperty({
        name: 'post_inspirations',
        description: 'Requirements for post_inspirations which includes max points possible and the requirement to receive those',
        required: false,
        type: EditPostInspirationOptions,
        isArray: false
    })
    @ValidateIf(obj => obj.type === 'auto')
    @IsOptional()
    @ValidateNested()
    @Type(() => EditPostInspirationOptions)
    public post_inspirations: EditPostInspirationOptions;

    @ApiProperty({
        name: 'posts_made',
        description: 'Requirements for rubric based scoring',
        required: false,
        type: [EditGradingCriteria],
        isArray: true
    })
    @ValidateIf(obj => obj.type === 'rubric')
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => EditGradingCriteria)
    public criteria: EditGradingCriteria [];
     

    constructor(partial: Partial<ScoreEditDTO>) {
        if(partial) {
            this.type = partial.type;
            this.total = partial.total;

            if(this.type === 'auto') {
                this.posts_made = partial.posts_made;
                this.active_days = partial.active_days;
                this.comments_received = partial.comments_received;
                this.post_inspirations = partial.post_inspirations;
            }
            if(this.type === 'rubric') {
                this.criteria = partial.criteria;
            }
        }
    }

    
}