function Info2(start, end)
{
	this.start = start;
	this.end = end;
}

class QuickSort extends Sorting
{
	constructor(bars, canvasWidth, canvasHeight, canvasWidth2, canvasHeight2, whichAlgo)
	{

		// Calling the super classes' constuctor
		super(bars, canvasWidth, canvasHeight, whichAlgo);

		this.stack = [];
		this.stack.push( new Info2(0, this.bars.length - 1));

		this.top = null;
		this.partitioning = false;
		this.starting = true;
		this.pos = -1;
		this.i = -1;
		this.j = -1;
		this.pivot = -1;
	
		this.donePartioning = false;	
	}

	partition(deltaTime)
	{
		if (!this.isAnimating)
		{
			if (this.swapped)
			{
				this.bar1.useThird = false;
				this.bar2.useThird = false;
				this.swapped = false;
			}
			else
			{
				if (!this.donePartioning)
				{
					if (this.j - 1 >= 0)
						this.bars[this.j - 1].isCompaired = false;

					if (this.j <= this.top.end)
					{

						this.bars[this.j].isCompaired  = true;

						if (this.bars[this.j].len < this.bars[this.pivot].len)
						{
							this.i++;
							if (this.i < this.j)
							{
								this.bar1 = this.bars[this.i];
								this.bar2 = this.bars[this.j];
								this.bars[this.i].isCompaired = true;
								this.bar1.compairednumberXPos = this.bar2.index;
								this.bar2.compairednumberXPos = this.bar1.index;

								this.bars[this.i].moveSpeed = (this.bars[this.i].baseMoveSpeed) * 3;
								this.bars[this.j].moveSpeed = this.bars[this.i].moveSpeed;

								this.swap(this.i, this.j);
								this.isAnimating = true;
							}
							else 
							{
								this.iPos = this.bars[this.i + 1].numberXPos;
							}
						}
						this.j++;
					}
					else
					{
						if (this.i + 1 < this.pivot)
						{

							this.bar1 = this.bars[this.i + 1];
							this.bar2 = this.bars[this.pivot];
							this.bars[this.i + 1].isCompaired = true;
							this.bars[this.pivot].isCompaired = true;
							this.bar1.compairednumberXPos = this.bar2.index;
							this.bar2.compairednumberXPos = this.bar1.index;

							this.bars[this.i + 1].moveSpeed = (this.bars[this.i + 1].baseMoveSpeed) * 3;
							this.bars[this.pivot].moveSpeed = this.bars[this.i + 1].moveSpeed;

							this.isAnimating = true;
							this.swap(this.i + 1, this.pivot);
						}
						this.donePartioning = true;
					}
				}
				else
				{
					this.donePartioning = false;
					this.partitioning = false;
					this.pos = this.i + 1;
					this.start = this.top.start;
					this.end = this.top.end;
					this.bars[this.pos].useFourth = true; 
					this.bars[this.pos].finishColor = false;
				}
			}
		}
		else
		{
			this.animate(deltaTime);
		}
	}
	
	update22(timeStamp, speed)
	{
		var deltaTime = timeStamp - this.lastTime;
		this.lastTime = timeStamp;

		if (this.stack.length <= 0)
		{
			this.resetFlags();
			this.x1 = -1;
			this.done = true;
		}

		else
		{
			if (!this.waiting || !this.isFrameByFrame)
			{
				if (this.partitioning)
				{
					this.partition(deltaTime);
				}

				else if (this.starting)
				{
					this.starting = false;
					this.top = this.stack[this.stack.length - 1];

					this.x1 = this.bars[this.top.start].numberXPos;
					this.x2 = this.bars[this.top.end].numberXPos;
					this.i = this.top.start - 1;
					this.j = this.top.start;
					this.pivot = this.top.end;

					this.bars[this.pivot].finishColor2 = true;

					this.partitioning = true;
				}
				else
				{
					this.starting = true;
					this.partitioning = false;

					for (let i = this.top.start; i <= this.top.end; i++)
						this.bars[i].finishColor = false;

					this.stack.pop();

					if (this.pos + 1 < this.end)
						this.stack.push(new Info2(this.pos + 1, this.end));
					else if (this.pos + 1 <= this.bars.length - 1)
						this.bars[this.pos + 1].useFourth = true;
					if (this.start < this.pos - 1)
						this.stack.push(new Info2(this.start, this.pos - 1));
					else if (this.start >= 0)
						this.bars[this.start].useFourth = true;
				}
			}
		}

		if (speed > 0)
			return this.update22(timeStamp, speed - 1);
		else
			return this.done;	
	}

	update(timeStamp)
	{
		return this.update22(timeStamp, 1);
	}	

}
