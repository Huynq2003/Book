import React, { useState } from 'react';
import { Form, Input, Button, Select, Checkbox,  Row, Col, Upload, message } from 'antd';
import { useMutation} from '@tanstack/react-query'
import { Book } from '../types';
import { axiosClient } from '../library/AxioscCient';
import { UploadOutlined } from '@ant-design/icons';
import config from '../constant/config';

const { Option } = Select;

interface AddBookFormProps {
  onAddBook: (grade: string, book: Book) => void;
  onUpdateBook?: (book: Book) => void;
  editingBook?: Book | null;
  setEditingBook?: (book: Book | null) => void;
}

interface IProduct {
  bookTitle: string;
  description?: string;
  productcode?:string;
  price?: number;
  author?: number;
  thumbnail?: string;
  classroom:string;
  category:string;
  isSale?: boolean;
  isHot?: boolean;
  createdAt: Date;
  time: string;
}
const AddBookForm: React.FC<AddBookFormProps> = ({
  onAddBook,
  onUpdateBook,
  editingBook,
  setEditingBook
}) => {
  const [form] = Form.useForm();
  const [grade, setGrade] = useState<string>(''); 
  const [category, setCategory] = useState<string>(''); 
  const [isBestSeller, setIsBestSeller] = useState<boolean>(false); 
  const [isFeatured, setIsFeatured] = useState<boolean>(false); 
  const [messageApi, contextHolder] = message.useMessage();

  const categories = ['Bộ Cánh Diều', 'Bộ Chân Trời', 'Bộ Kết Nối', 'Bộ Bình Đẳng', 'Bộ Cùng Học'];

  const fetchCreate = async (formData: IProduct) => {
    console.log(formData);
    return axiosClient.post("/v1/products", formData);
  };
  const mutationCreate = useMutation({
    mutationFn: fetchCreate,
    onSuccess: () => {
      console.log("Create success !");
      messageApi.open({
        type: "success",
        content: "Create success !",
      });
      form.resetFields();
    },
    onError: () => {
      messageApi.open({
        type: "error",
        content: "Create error !",
      });
    },
  });
  const onFinish = (values: IProduct) => {
    console.log("Success:", values);
    mutationCreate.mutate(values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  //   if (editingBook) {
  //     form.setFieldsValue(editingBook);
  //     setGrade(editingBook.grade || ''); 
  //     setCategory(editingBook.category || ''); 
  //     setIsBestSeller(editingBook.isBestSeller || false); // Cập nhật trạng thái Bán chạy
  //     setIsFeatured(editingBook.isFeatured || false);     // Cập nhật trạng thái Nổi bật
  //   }
  // }, [editingBook, form]);

  // const handleFinish = (values: any) => {
  //   const book: Book = {
  //     ...values,
  //     id: editingBook?.id || Date.now(),
  //     grade,
  //     category, 
  //     isBestSeller, // Thêm trạng thái Bán chạy vào book
  //     isFeatured,   // Thêm trạng thái Nổi bật vào book
  //   };

  //   if (editingBook) {
  //     onUpdateBook && onUpdateBook(book);
  //     notification.success({ message: 'Cập nhật sách thành công!' });
  //     setEditingBook && setEditingBook(null);
  //   } else {
  //     onAddBook(grade, book);
  //     // notification.success({ message: 'Thêm sách thành công!' });
  //   }

  //   form.resetFields();
  //   setGrade('');
  //   setCategory('');
  //   setIsBestSeller(false); // Đặt lại trạng thái Bán chạy
  //   setIsFeatured(false);   // Đặt lại trạng thái Nổi bật
  // };

  return (
    <>
    
    {contextHolder}
    <Form form={form} layout="vertical" onFinish={onFinish} onFinishFailed={onFinishFailed}>
      <Form.Item<IProduct>
        name="bookTitle"
        label="Tiêu đề"
        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề sách!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item<IProduct>
        name="author"
        label="Tác giả"
        rules={[{ required: true, message: 'Vui lòng nhập tác giả!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item<IProduct>
        name="productcode"
        label="Mã sản phẩm"
        rules={[{ required: true, message: 'Vui lòng nhập mã sản phẩm!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item<IProduct>
        name="price"
        label="Giá"
        rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
      >
        <Input type="number" />
      </Form.Item>
      <Form.Item<IProduct> name="description" label="Mô tả">
        <Input.TextArea />
      </Form.Item>
      <Form.Item<IProduct> label="Thumbnail" name="thumbnail">
          <Input />
        </Form.Item>
        <Row style={{ margin: "20px 0" }}>
          <Col offset={4}>
            <Upload
              action={`${config.urlAPI}/v1/upload/single`}
              listType="picture"
              onChange={(file) => {
                console.log(file, file.file.status);
                if (file.file.status === "done") {
                  form.setFieldValue(
                    "thumbnail",
                    file.file.response.data.link
                  );
                }
              }}
              onRemove={(file) => {
                console.log(file);
                form.setFieldValue("thumbnail", null);
              }}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Col>
        </Row>
      <Form.Item<IProduct>
        name="classroom"
        label="Lớp học"
        rules={[{ required: true, message: 'Vui lòng chọn lớp học!' }]}
        required
      >
        <Select
          value={grade}
          onChange={(value: string) => setGrade(value)}
          placeholder="Chọn lớp học"
          style={{ width: '100%' }}
        >
          {[...Array(12).keys()].map(num => (
            <Option key={num + 1} value={(num + 1).toString()}>
              Lớp {num + 1}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item<IProduct>
        name="category"
        label="Thể loại"
        rules={[{ required: true, message: 'Vui lòng chọn thể loại!' }]}
        required
      >
        <Select
          value={category}
          onChange={(value: string) => setCategory(value)}
          placeholder="Chọn thể loại"
          style={{ width: '100%' }}
        >
          {categories.map((cat) => (
            <Option key={cat} value={cat}>
              {cat}
            </Option>
          ))}
        </Select>
      </Form.Item>
      
      {/* Checkbox cho sản phẩm bán chạy */}
      <Form.Item<IProduct>>
        <Checkbox
          checked={isBestSeller}
          onChange={(e) => setIsBestSeller(e.target.checked)}
        >
          Sản phẩm khuyến mãi
        </Checkbox>
      </Form.Item>

      {/* Checkbox cho sản phẩm nổi bật */}
      <Form.Item<IProduct>>
        <Checkbox
          checked={isFeatured}
          onChange={(e) => setIsFeatured(e.target.checked)}
        >
          Sản phẩm nổi bật
        </Checkbox>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          {editingBook ? 'Cập nhật sách' : 'Thêm sách'}
        </Button>
      </Form.Item>
    </Form>
    </>
  );
};

export default AddBookForm;
