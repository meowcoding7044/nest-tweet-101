import { UsersRepository } from '../users.repository';
import { Repository } from 'typeorm';
import { UserEntity } from '../../entities/user.entity';
import { PaginationProvider } from 'src/common/pagination/pagination.provider';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';

describe('UsersRepository', () => {
  let repo: UsersRepository;
  let ormRepo: jest.Mocked<Repository<UserEntity>>;
  let paginationProvider: jest.Mocked<PaginationProvider>;

  beforeEach(() => {
    ormRepo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      findAndCount: jest.fn(),
    } as any;

    paginationProvider = {
      paginateQuery: jest.fn(),
    } as any;

    repo = new UsersRepository(ormRepo as any, paginationProvider);
  });

  it('✅ should find user by ID', async () => {
    const userEntity = { id: 1, username: 'john', email: 'john@example.com' } as UserEntity;
    ormRepo.findOne.mockResolvedValueOnce(userEntity);

    const result = await repo.findById(1);

    expect(result?.id).toBe(1);
    expect(result?.username).toBe('john');
    expect(ormRepo.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['profile'],
    });
  });

  it('✅ should create a new user', async () => {
    const partialUser = { username: 'alice', email: 'alice@example.com' };
    const savedEntity = { id: 1, ...partialUser } as UserEntity;

    ormRepo.create.mockReturnValueOnce(partialUser as any);
    ormRepo.save.mockResolvedValueOnce(savedEntity);

    const result = await repo.createUser(partialUser);

    expect(result.id).toBe(1);
    expect(result.username).toBe('alice');
  });

  it('✅ should return paginated users', async () => {
    const paginationDto: PaginationQueryDto = { page: 1, limit: 10 };

    paginationProvider.paginateQuery.mockResolvedValueOnce({
      data: [{ id: 1, username: 'bob', email: 'bob@example.com' }],
      meta: { itemsPerPage: 10, totalItems: 1, currentPage: 1, totalPages: 1 },
      links: { first: '', last: '', current: '', next: null, previous: null },
    });

    const result = await repo.findAllPaginated(paginationDto);

    expect(result.data).toHaveLength(1);
    expect(paginationProvider.paginateQuery).toHaveBeenCalledTimes(1);
  });

  it('✅ should delete user', async () => {
    await repo.deleteUser(99);
    expect(ormRepo.delete).toHaveBeenCalledWith(99);
  });
});
