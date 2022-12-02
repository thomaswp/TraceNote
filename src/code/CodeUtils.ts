import { VarType } from "./ExecutionTrace";
import { Expression } from "./Expression";
import { GetVariable } from "./GetVariable";
import { Literal, LiteralType } from "./Literal";
import { Variable } from "./Variable";

export type ExpressionLike<T extends VarType> = T | Variable<T> | Expression<T>;

export function toExpression<T extends VarType>(value: ExpressionLike<T>, literalType?: LiteralType) {
    if (value instanceof Expression) return value;
    if (value instanceof Variable) return new GetVariable(value);
    if (!literalType) literalType = Literal.inferType(value);
    return new Literal(value, literalType);
}